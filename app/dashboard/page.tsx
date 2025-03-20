'use client';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getAuth, signOut, User as FirebaseUser } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, getFirestore, onSnapshot, query, Timestamp, updateDoc, where } from 'firebase/firestore';
import { Calendar, Edit, Loader2, LogOut, PlusCircle, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { CalendlyModal } from '@/components/dashboard/CalendlyModal';
import { InvitePartnerForm } from '@/components/InvitePartnerForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserProfileForm } from '@/components/UserProfileForm';
import { ZenClickButton } from '@/components/ZenClickButton';
import { extractEventIdFromUri } from '@/lib/calendly';
import { coupleTherapyJourney, TherapyJourneyEvent } from '@/lib/coupleTherapyJourney';
import { app } from '@/lib/firebase';
import { createOrUpdateUser, getPartnerProfile, getUserById, User as UserProfile } from '@/lib/userService';

export default function DashboardPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [partnerProfile, setPartnerProfile] = useState<UserProfile | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isCalendlyModalOpen, setIsCalendlyModalOpen] = useState(false);
  const [hasAppointment, setHasAppointment] = useState(false);
  const [selectedSession, setSelectedSession] = useState<TherapyJourneyEvent | null>(null);
  const [completedSessions, setCompletedSessions] = useState<Set<string>>(new Set());
  const [sessionDates, setSessionDates] = useState<Record<string, string>>({});
  const [invalidDates, setInvalidDates] = useState<Record<string, boolean>>({});
  const [uiRefreshKey, setUiRefreshKey] = useState<number>(0);
  const router = useRouter();

  // Function to handle sign out
  const handleSignOut = async () => {
    try {
      const auth = getAuth(app);
      await signOut(auth);
      toast.success('Déconnexion réussie');
      router.push('/'); // Redirect to home page after sign out
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  useEffect(() => {
    const auth = getAuth(app);

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);

        async function fetchUserProfile() {
          if (!user || !user.uid) return;

          try {
            const profileData = await getUserById(user.uid);
            setUserProfile(profileData);

            if (profileData?.partnerId) {
              const partnerData = await getPartnerProfile(profileData.partnerId);
              setPartnerProfile(partnerData);
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
            toast.error('Failed to load user profile');
          } finally {
            setLoading(false);
          }
        }

        fetchUserProfile();
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Fetch user data when component mounts or when UI needs refresh
  useEffect(() => {
    if (user) {
      // Fetch user profile data
      async function fetchUserProfile() {
        if (!user || !user.uid) return;

        try {
          const profileData = await getUserById(user.uid);
          setUserProfile(profileData);

          if (profileData?.partnerId) {
            const partnerData = await getPartnerProfile(profileData.partnerId);
            setPartnerProfile(partnerData);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          toast.error('Failed to load user profile');
        } finally {
          setLoading(false);
        }
      }

      fetchUserProfile();
    }
  }, [user, uiRefreshKey]);

  // Initialize session state from user profile
  useEffect(() => {
    if (userProfile) {
      // Initialize completed sessions
      if (userProfile.completedSessions && userProfile.completedSessions.length > 0) {
        setCompletedSessions(new Set(userProfile.completedSessions));
      }

      // Initialize session dates
      if (userProfile.sessionDates) {
        setSessionDates(userProfile.sessionDates);
      }
    }
  }, [userProfile]);

  // Periodically check if any scheduled sessions should now be marked as completed
  useEffect(() => {
    if (!userProfile || !sessionDates) return;

    // Function to update completed sessions in the database
    const updateCompletedSessionsInDatabase = async (newlyCompletedSessions: string[]) => {
      if (newlyCompletedSessions.length === 0) return;

      // Current completed sessions from the database
      const currentCompletedSessions = userProfile.completedSessions || [];

      // Combine existing and new completed sessions, removing duplicates
      const allCompletedSessions = [...new Set([...currentCompletedSessions, ...newlyCompletedSessions])];

      // Update the user profile in the database
      try {
        const updatedProfile = {
          ...userProfile,
          completedSessions: allCompletedSessions
        };

        await createOrUpdateUser(updatedProfile);

        // Update local state
        setCompletedSessions(new Set(allCompletedSessions));

        console.log('Updated completed sessions in database:', allCompletedSessions);
      } catch (error) {
        console.error('Error updating completed sessions in database:', error);
      }
    };

    // Check all scheduled sessions to see if any should be marked as completed
    const checkCompletedSessions = () => {
      const currentTime = new Date();
      const newlyCompletedSessions: string[] = [];

      // Get all therapy journey events
      const allEvents = [
        ...coupleTherapyJourney.filter(e => e.phase === 'initial'),
        ...coupleTherapyJourney.filter(e => e.phase === 'individual' && e.partner === 'partner1'),
        ...coupleTherapyJourney.filter(e => e.phase === 'individual' && e.partner === 'partner2'),
        ...coupleTherapyJourney.filter(e => e.phase === 'final')
      ];

      // Check each event with a scheduled date
      allEvents.forEach(event => {
        const sessionId = event.id;
        const sessionDate = sessionDates[sessionId];

        // Skip if session is already marked as completed or doesn't have a date
        if (completedSessions.has(sessionId) || !sessionDate) return;

        try {
          const sessionDateTime = new Date(sessionDate);

          // Add 1 hour to the session date
          const sessionEndTime = new Date(sessionDateTime);
          sessionEndTime.setHours(sessionEndTime.getHours() + 1);

          // If the session end time has passed, mark as completed
          if (sessionEndTime <= currentTime) {
            newlyCompletedSessions.push(sessionId);
          }
        } catch (error) {
          console.error(`Error checking completion for session ${sessionId}:`, error);
        }
      });

      // Update database if there are newly completed sessions
      if (newlyCompletedSessions.length > 0) {
        console.log('Found sessions to mark as completed:', newlyCompletedSessions);
        updateCompletedSessionsInDatabase(newlyCompletedSessions);
      }
    };

    // Initial check
    checkCompletedSessions();

    // Set interval to check every minute (adjust as needed)
    const intervalId = setInterval(checkCompletedSessions, 60000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [userProfile, sessionDates, completedSessions]);

  // Function to check if a date is valid (at least 4 weeks after the previous session)
  const isDateValid = useCallback((sessionId: string, dateStr: string): boolean => {
    // Define session dependencies (which session must be at least 4 weeks after which)
    const sessionDependencyMap: Record<string, string> = {
      'partner1_session_1': 'initial_session',
      'partner2_session_1': 'initial_session',
      'partner1_session_2': 'partner1_session_1',
      'partner2_session_2': 'partner2_session_1',
      'final_session': 'partner2_session_2'
    };

    try {
      const dependentSessionId = sessionDependencyMap[sessionId];
      if (!dependentSessionId) return true; // No dependency, date is valid

      const dependentSessionDate = sessionDates[dependentSessionId];
      if (!dependentSessionDate) return true; // No dependent session date, date is valid

      const proposedDate = new Date(dateStr);
      const previousDate = new Date(dependentSessionDate);

      // Add 4 weeks to the previous session date
      const minDate = new Date(previousDate);
      minDate.setDate(minDate.getDate() + 28); // 4 weeks = 28 days

      // Date is valid if it's at least 4 weeks after the previous session
      return proposedDate >= minDate;
    } catch (error) {
      console.error(`Error validating date for session ${sessionId}:`, error);
      return false;
    }
  }, [sessionDates]);

  // Debugging for session dates
  useEffect(() => {
    console.log('------- DEBUG SESSION DATES -------');
    console.log('Session Dates:', sessionDates);

    // Check each session date
    Object.entries(sessionDates).forEach(([sessionId, dateStr]) => {
      const isValid = isDateValid(sessionId, dateStr);
      console.log(`Session ${sessionId}:`, {
        date: dateStr,
        isValid
      });
    });

    console.log('------- END DEBUG -------');
  }, [sessionDates, isDateValid]);

  // Validate all existing dates when session dates change
  useEffect(() => {
    const newInvalidDates: Record<string, boolean> = {};

    // Check each session date
    Object.entries(sessionDates).forEach(([sessionId, dateStr]) => {
      newInvalidDates[sessionId] = !isDateValid(sessionId, dateStr);
    });

    // Update invalid dates state
    setInvalidDates(newInvalidDates);
  }, [sessionDates, isDateValid]);

  // Function to handle update profile
  const handleUpdateProfile = async (formData: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const userData: UserProfile = {
        ...userProfile,
        ...formData,
        email: user.email || formData.email || '',
        updatedAt: Timestamp.now()
      };

      const updatedProfile = await createOrUpdateUser(userData);
      setUserProfile(updatedProfile);
      setIsEditingProfile(false);
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    }
  };

  // Function to handle invite partner
  const handleInvitePartner = async (email: string) => {
    if (!userProfile || !user) return;

    try {
      // Update the userProfile with the partner email
      const updatedUser = await createOrUpdateUser({
        ...userProfile,
        partnerEmail: email,
        updatedAt: Timestamp.now()
      });

      setUserProfile(updatedUser);
      setIsInviting(false);
      toast.success('Invitation envoyée avec succès');

      // Force UI refresh
      setUiRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Error inviting partner:', error);
      toast.error('Erreur lors de l\'envoi de l\'invitation');
    }
  };

  // Function to handle photo click
  const handlePhotoClick = () => {
    setIsEditingProfile(true);
  };

  // Therapy Journey Logic
  const isSessionAvailable = (event: TherapyJourneyEvent): boolean => {
    if (event.type !== 'session') return false;

    // First check if there are any invalid dates in previous sessions
    if (event.id !== 'initial_session' && hasPreviousInvalidDates(event.id)) {
      return false;
    }

    // Special case for first individual session for partner 1
    // Make it available immediately after initial session is completed OR has a date set
    if (event.id === 'partner1_session_1') {
      return (isSessionCompleted('initial_session') || !!sessionDates['initial_session']) &&
        !invalidDates['initial_session'];
    }

    if (!event.dependsOn) return true;

    if (Array.isArray(event.dependsOn)) {
      return event.dependsOn.every(dep =>
        (isSessionCompleted(dep) || !!sessionDates[dep]) && !invalidDates[dep]
      );
    }

    return (
      (isSessionCompleted(event.dependsOn) || !!sessionDates[event.dependsOn]) &&
      !invalidDates[event.dependsOn]
    );
  };

  // Function to check if any previous sessions have invalid dates
  const hasPreviousInvalidDates = (eventId: string): boolean => {
    // Session dependency order
    const sessionOrder = [
      'initial_session',
      'partner1_session_1',
      'partner1_session_2',
      'partner1_session_3',
      'partner2_session_1',
      'partner2_session_2',
      'partner2_session_3',
      'final_session'
    ];

    // Find current event index
    const currentIndex = sessionOrder.indexOf(eventId);
    if (currentIndex <= 0) return false; // No previous sessions or it's the initial session

    // Check all previous sessions in the dependency chain
    for (let i = 0; i < currentIndex; i++) {
      const prevSessionId = sessionOrder[i];
      // If previous session is in invalidDates list, return true
      if (invalidDates[prevSessionId]) {
        console.log(`Session ${eventId} cannot be scheduled because ${prevSessionId} has an invalid date`);
        return true;
      }
    }

    return false;
  };

  const getSessionDateConstraints = (event: TherapyJourneyEvent) => {
    const minDate = new Date();

    // For the first individual session for partner 1, set minimum date to 4 weeks after initial session
    if (event.id === 'partner1_session_1' && sessionDates['initial_session']) {
      const initialSessionDate = new Date(sessionDates['initial_session']);
      minDate.setTime(initialSessionDate.getTime());
      minDate.setDate(minDate.getDate() + 28); // 4 weeks = 28 days
      console.log(`Setting min date for partner1_session_1 to 4 weeks after initial session: ${minDate.toISOString()}`);
    } else if (event.dependsOn && event.daysOffset) {
      const dependentId = Array.isArray(event.dependsOn) ? event.dependsOn[0] : event.dependsOn;

      if (sessionDates[dependentId]) {
        const dependentDate = new Date(sessionDates[dependentId]);
        minDate.setTime(dependentDate.getTime());
        minDate.setDate(minDate.getDate() + event.daysOffset);
      }
    }

    const maxDate = new Date(minDate);
    maxDate.setDate(maxDate.getDate() + 30); // Allow booking up to 30 days after min date

    return { minDate, maxDate };
  };

  const getSessionUnavailableReason = (event: TherapyJourneyEvent): string => {
    // Check if there are invalid dates in previous sessions
    if (event.id !== 'initial_session' && hasPreviousInvalidDates(event.id)) {
      return "Impossible de réserver cette séance car une ou plusieurs séances précédentes ne respectent pas l'écart de 4 semaines requis.";
    }

    // Check if dependencies are completed
    if (event.dependsOn) {
      // Handle array of dependencies
      if (Array.isArray(event.dependsOn)) {
        const missingDeps = event.dependsOn.filter(dep => !isSessionCompleted(dep) && !sessionDates[dep]);
        if (missingDeps.length > 0) {
          return "Veuillez d'abord compléter les étapes précédentes.";
        }

        // Check if any dependency has an invalid date
        const invalidDeps = event.dependsOn.filter(dep => invalidDates[dep]);
        if (invalidDeps.length > 0) {
          return "Une ou plusieurs séances précédentes ne respectent pas l'écart de 4 semaines requis.";
        }
      }
      // Handle single dependency
      else {
        if (!isSessionCompleted(event.dependsOn) && !sessionDates[event.dependsOn]) {
          return "Veuillez d'abord compléter les étapes précédentes.";
        }

        if (invalidDates[event.dependsOn]) {
          return "La séance précédente ne respecte pas l'écart de 4 semaines requis.";
        }
      }
    }

    return "";
  };

  const handleSessionClick = (event: TherapyJourneyEvent) => {
    // If this is a session that already has a date, don't allow rebooking
    if (sessionDates[event.id]) {
      toast.error("Cette séance est déjà programmée. Utilisez le bouton d'annulation si vous souhaitez la reprogrammer.");
      return;
    }

    // Normal availability check for new bookings
    if (!isSessionAvailable(event)) {
      const reason = getSessionUnavailableReason(event);
      toast.error(reason || "Veuillez d'abord compléter les étapes précédentes");
      return;
    }

    if (event.type !== 'session' || !event.sessionType) {
      toast.error("Ce type d'événement ne peut pas être programmé");
      return;
    }

    setSelectedSession(event);
    setIsCalendlyModalOpen(true);
  };

  const handleAppointmentScheduled = async (eventData: any) => {
    try {
      if (!user || !selectedSession) return;

      console.log('Appointment scheduled data:', eventData);
      
      // Get the event URI from the data
      let formattedUri = eventData.eventUri;
      
      // Format the URI if needed
      if (!formattedUri.startsWith('http')) {
        formattedUri = `https://api.calendly.com/scheduled_events/${formattedUri}`;
      }

      console.log(`Using event URI: ${formattedUri}`);
      
      // Check if we already have the start time directly from the event data
      let startTime = eventData.startTime || eventData.payload?.event?.start_time || null;
      let eventDetails: any = null;
      
      // If we don't have the start time directly, fetch it from the API
      if (!startTime) {
        // Get the event details from our API
        console.log("No direct start time available, fetching from API");
        const response = await fetch(`/api/calendly/event-details?eventUri=${encodeURIComponent(formattedUri)}`);

        if (!response.ok) {
          const errorData = await response.json();
          console.error("API error:", errorData);
          throw new Error(`Failed to fetch event details: ${response.status} - ${errorData.error || 'Unknown error'}`);
        }

        eventDetails = await response.json();
        console.log('Fetched event details:', eventDetails);

        if (!eventDetails.data) {
          throw new Error("No event data returned from API");
        }
        
        startTime = eventDetails.data.start_time;
      } else {
        console.log("Using direct start time from event data:", startTime);
      }
      
      if (!startTime) {
        throw new Error("Could not determine the appointment start time");
      }
      
      // If we didn't need to fetch event details earlier, do it now for other data
      if (!eventDetails) {
        try {
          const response = await fetch(`/api/calendly/event-details?eventUri=${encodeURIComponent(formattedUri)}`);
          if (response.ok) {
            eventDetails = await response.json();
            console.log('Fetched additional event details:', eventDetails);
          }
        } catch (error) {
          console.warn("Could not fetch additional event details:", error);
          // Continue anyway since we have the start time
        }
      }

      // Format date for display
      const dateObj = new Date(startTime);
      const formattedDate = new Intl.DateTimeFormat('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }).format(dateObj);

      // Format to capitalize first letter of day name
      const formattedDateCapitalized = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

      // Get a reference to the user's document
      const db = getFirestore(app);
      const userDocRef = doc(db, 'users', user.uid);

      // Create the session details object with the new data
      const sessionDetails: any = {
        date: formattedDate,
        eventUri: formattedUri,
        formattedDate: formattedDateCapitalized,
        startTime: startTime,
        lastUpdated: Timestamp.now()
      };
      
      // Add additional fields if we have the full event details
      if (eventDetails?.data) {
        sessionDetails.endTime = eventDetails.data.end_time;
        sessionDetails.location = eventDetails.data.location;
        sessionDetails.cancelUrl = eventDetails.data.invitee?.cancel_url || eventDetails.data.cancel_url;
      }

      console.log("Updating Firestore with session details:", sessionDetails);
      
      // Update Firestore with the new session details
      await updateDoc(userDocRef, {
        [`sessionDetails.${selectedSession.id}`]: sessionDetails,
        [`sessionDates.${selectedSession.id}`]: startTime,
        updatedAt: Timestamp.now()
      });

      // Alert the user with a unique ID to prevent duplicates
      toast.success(`Votre séance est programmée pour le ${formattedDateCapitalized}`, {
        id: `appointment-${selectedSession.id}-${Date.now()}`,
        onDismiss: () => {
          // Clean up any duplicate toasts
          document.querySelectorAll('[data-sonner-toast]').forEach(el => {
            if (el.textContent?.includes('séance') && el.textContent?.includes(formattedDateCapitalized)) {
              el.remove();
            }
          });
        }
      });

      console.log(`Updated session ${selectedSession.id} in Firestore with new date: ${formattedDate}`);

      // Close the modal
      setIsCalendlyModalOpen(false);

      // Update session dates in state to reflect the new date
      setSessionDates(prev => ({
        ...prev,
        [selectedSession.id]: startTime
      }));

      // Check if the date is valid, and update invalidDates set if needed
      const isValid = isDateValid(selectedSession.id, startTime);
      if (!isValid) {
        setInvalidDates(prev => ({ ...prev, [selectedSession.id]: true }));
      } else if (invalidDates[selectedSession.id]) {
        const newInvalidDates = { ...invalidDates };
        delete newInvalidDates[selectedSession.id];
        setInvalidDates(newInvalidDates);
      }

      // Clear the selected session
      setSelectedSession(null);
      
      // Trigger a UI refresh
      setUiRefreshKey(prev => prev + 1);
      
      // No need to reload the page - the state updates above will trigger a UI refresh
    } catch (error) {
      console.error("Error handling appointment scheduling:", error);
      toast.error("Une erreur s'est produite lors de la programmation. Veuillez réessayer.");
      setIsCalendlyModalOpen(false);
    }
  };

  // Check if a session should be marked as completed based on its date
  const isSessionCompleted = (sessionId: string): boolean => {
    // If it's in completedSessions from database/state, it's completed
    if (completedSessions.has(sessionId)) {
      return true;
    }

    // If the session has a scheduled date, check if that time + 1 hour has passed
    const sessionDate = sessionDates[sessionId];
    if (sessionDate) {
      try {
        const sessionDateTime = new Date(sessionDate);

        // Add 1 hour to the session date
        const sessionEndTime = new Date(sessionDateTime);
        sessionEndTime.setHours(sessionEndTime.getHours() + 1);

        // Compare with current time
        const currentTime = new Date();

        // If the session end time has passed, mark as completed
        if (sessionEndTime <= currentTime) {
          // Don't update state here to avoid re-renders during render
          return true;
        }
      } catch (error) {
        console.error('Error checking session completion status:', error);
      }
    }

    return false;
  };

  // Render journey timeline by phase
  const renderJourneyPhase = (phase: 'initial' | 'individual' | 'final', partner?: 'partner1' | 'partner2') => {
    const events = coupleTherapyJourney.filter(e => e.phase === phase && (!partner || e.partner === partner));

    // Debug info
    if (phase === 'initial') {
      console.log('Initial session date:', sessionDates['initial_session']);
      console.log('Initial session completed:', isSessionCompleted('initial_session'));
      console.log('Partner1 session 1 date:', sessionDates['partner1_session_1']);
      console.log('Partner1 session 1 available:', isSessionAvailable(
        events.find(e => e.id === 'partner1_session_1') || events[0]
      ));
    }

    return (
      <div className="space-y-3">
        {events.map((event) => {
          const isComplete = isSessionCompleted(event.id);
          const isAvailable = isSessionAvailable(event);

          // Log availability for debugging
          if (['initial_session', 'partner1_session_1'].includes(event.id)) {
            console.log(`Event ${event.id} availability:`, {
              isComplete,
              isAvailable,
              hasDate: !!sessionDates[event.id],
              dateValue: sessionDates[event.id]
            });
          }

          // Format date if exists
          let dateStr = '';
          if (sessionDates[event.id]) {
            try {
              const sessionDate = new Date(sessionDates[event.id]);
              if (!isNaN(sessionDate.getTime())) {
                // Capitalize first letter of the day name
                dateStr = format(sessionDate, 'EEEE d MMMM yyyy à HH:mm', { locale: fr });
                dateStr = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
              } else {
                console.error(`Invalid date for event ${event.id}:`, sessionDates[event.id]);
                dateStr = 'Date invalide';
              }
            } catch (error) {
              console.error(`Error formatting date for event ${event.id}:`, error);
              dateStr = 'Erreur de date';
            }
          }

          if (event.type !== 'session') return null;

          // Determine if this event should have a booking button (all events except partner2 sessions)
          const showBookingButton = (phase === 'initial' || phase === 'final' ||
            (phase === 'individual' && partner === 'partner1'));

          // Debug the information for partner1_session_1
          if (event.id === 'partner1_session_1') {
            console.log('partner1_session_1 details:', {
              phase,
              partner,
              showBookingButton,
              isComplete,
              isAvailable,
              hasDate: !!sessionDates[event.id]
            });
          }

          return (
            <div key={event.id} className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div
                  className={`p-1 rounded ${isComplete
                      ? 'text-emerald-500'
                      : isAvailable
                        ? 'text-primary-cream'
                        : 'text-primary-cream/30'
                    }`}
                >
                  {isComplete ? (
                    <Calendar className="w-5 h-5" />
                  ) : (
                    <Calendar className="w-5 h-5" />
                  )}
                </div>
                <div className={isAvailable ? 'text-[rgb(247_237_226_)]' : 'text-[rgb(247_237_226_)]/30'}>
                  <div className="font-medium">
                    {event.title}
                    {partner === 'partner1' && !isComplete && isAvailable && !sessionDates[event.id] && (
                      <span className="block text-xs text-[rgb(247_237_226_)] mt-1">
                        Prendre rendez-vous {event.title.split(' - ')[0]}
                      </span>
                    )}
                  </div>

                  {/* Render the date with appropriate styling */}
                  {sessionDates[event.id] && (
                    <div
                      className={`text-sm mt-1 flex items-center gap-1.5 px-2 py-1 rounded-md w-fit
                        ${invalidDates[event.id]
                          ? 'text-red-400 font-medium bg-red-900/30'
                          : 'text-green-400 font-medium bg-green-900/30'
                        }`}
                    >
                      <Calendar className="w-4 h-4" />
                      <span>{dateStr}</span>
                      {invalidDates[event.id] && (
                        <span className="text-xs ml-1">
                          (moins de 4 semaines)
                        </span>
                      )}

                      {/* Add cancel button for valid dates */}
                      {!invalidDates[event.id] && userProfile?.sessionDetails?.[event.id]?.cancelUrl && (
                        <a
                          href={userProfile.sessionDetails[event.id].cancelUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-cream hover:text-primary-cream/80 transition-colors"
                          title="Annuler le rendez-vous"
                        >
                          <Edit className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {showBookingButton && !isComplete && isAvailable && !sessionDates[event.id] && (
                <div className="ml-8">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-8 border-[rgb(247_237_226_)]/30 text-[rgb(247_237_226_)] hover:bg-[rgb(247_237_226_)]/10 hover:text-[rgb(247_237_226_)]"
                    onClick={() => handleSessionClick(event)}
                  >
                    <Calendar className="w-3 h-3 mr-2" />
                    Réserver cette séance
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-forest flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary-cream/80" />
        </div>
      </div>
    );
  }

  return (
    <div key={uiRefreshKey} className="min-h-screen bg-primary-forest text-primary-cream">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary-coral text-center">Tableau de bord</h1>
          <div className="flex gap-4">
            <ZenClickButton />
            <Button
              variant="outline"
              className="border-primary-cream/20 text-primary-cream hover:bg-primary-cream/10 hover:text-primary-coral"
              onClick={handleSignOut}
            >
              <LogOut className="w-5 h-5 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="rounded-lg border border-primary-cream/20 bg-primary-cream/10 p-6">
            <div className="flex items-center gap-4">
              <div
                onClick={handlePhotoClick}
                className="relative w-16 h-16 rounded-full overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              >
                {userProfile?.photo ? (
                  <Image
                    src={userProfile.photo}
                    alt="Photo de profil"
                    className="object-cover"
                    fill
                    sizes="64px"
                  />
                ) : (
                  <div className="w-full h-full bg-primary-cream/10 flex items-center justify-center">
                    <User className="w-8 h-8 text-primary-cream/60" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-medium text-primary-cream">
                  {userProfile?.firstName} {userProfile?.lastName}
                </h2>
                <p className="text-sm text-primary-cream/60">{user?.email}</p>
              </div>
              <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                <DialogContent className="bg-primary-forest border-primary-cream/20 text-primary-cream">
                  <DialogHeader>
                    <DialogTitle className="text-primary-coral">Modifier votre profil</DialogTitle>
                    <DialogDescription className="text-primary-cream/60">
                      Mettez à jour vos informations personnelles
                    </DialogDescription>
                  </DialogHeader>
                  <UserProfileForm
                    user={userProfile}
                    onSubmit={handleUpdateProfile}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="rounded-lg border border-primary-cream/20 bg-primary-cream/10 p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                {userProfile?.partnerEmail ? (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-primary-cream/20">
                    <div className="absolute inset-0 flex items-center justify-center text-primary-cream/60">
                      <User className="w-8 h-8" />
                    </div>
                  </div>
                ) : partnerProfile?.photo ? (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-primary-cream/20">
                    <Image
                      src={partnerProfile.photo}
                      alt="Partner Profile"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-primary-cream/20">
                    <div className="absolute inset-0 flex items-center justify-center text-primary-cream/60">
                      <User className="w-8 h-8" />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1">
                {userProfile?.partnerEmail ? (
                  <h3 className="text-lg font-medium text-primary-cream">Votre Partenaire</h3>
                ) : partnerProfile ? (
                  <>
                    <h3 className="text-lg font-medium text-primary-cream">
                      {partnerProfile.firstName} {partnerProfile.lastName}
                    </h3>
                    <p className="text-sm text-primary-cream/60">{partnerProfile.email}</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-medium text-primary-cream">Votre Partenaire</h3>
                    <p className="text-sm text-primary-cream/60">Ajoutez votre partenaire ici et commencez votre parcours</p>
                  </>
                )}
              </div>
              {userProfile?.partnerEmail ? (
                <p className="text-sm text-primary-cream/60">Invitation envoyée à {userProfile.partnerEmail}</p>
              ) : !partnerProfile && (
                <Button
                  variant="outline"
                  className="border-primary-cream/20 text-primary-cream hover:bg-primary-cream/10 hover:text-primary-coral"
                  onClick={() => setIsInviting(true)}
                >
                  INVITER
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Dialogs and Modals */}
        <Dialog open={isInviting} onOpenChange={setIsInviting}>
          <DialogContent className="bg-primary-forest border-primary-cream/20 text-primary-cream">
            <DialogHeader>
              <DialogTitle className="text-primary-coral">Inviter votre partenaire</DialogTitle>
              <DialogDescription className="text-primary-cream/60">
                Envoyez une invitation à votre partenaire pour commencer votre parcours ensemble
              </DialogDescription>
            </DialogHeader>
            <InvitePartnerForm onSubmit={handleInvitePartner} onClose={() => setIsInviting(false)} />
          </DialogContent>
        </Dialog>

        {selectedSession && (
          <CalendlyModal
            isOpen={isCalendlyModalOpen}
            onClose={() => {
              setIsCalendlyModalOpen(false);
              setSelectedSession(null);
            }}
            sessionType="1h"
            onAppointmentScheduled={handleAppointmentScheduled}
            userEmail={userProfile?.email}
          />
        )}

        {/* Therapy Journey Section */}
        <div className="bg-[rgb(247_237_226_/0.1)] rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-2xl font-semibold mb-1 text-primary-coral">Votre parcours thérapeutique</h2>
          <p className="text-[rgb(247_237_226_)]/70 mb-6">Suivez l'avancement de votre parcours thérapeutique en couple.</p>

          {/* Display therapy journey phases */}
          <div className="mt-8 space-y-8">
            {/* Initial Phase */}
            <div>
              <h3 className="text-xl font-semibold text-primary-coral mb-4">Phase Initiale</h3>
              {renderJourneyPhase('initial')}
            </div>

            {/* Individual Phases */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Partner 1 Journey */}
              <div>
                <h3 className="text-xl font-semibold text-primary-coral mb-4">Parcours Individuel - Partenaire 1</h3>
                {renderJourneyPhase('individual', 'partner1')}
              </div>

              {/* Partner 2 Journey */}
              <div>
                <h3 className="text-xl font-semibold text-primary-coral mb-4">Parcours Individuel - Partenaire 2</h3>
                {renderJourneyPhase('individual', 'partner2')}
              </div>
            </div>

            {/* Final Phase */}
            <div>
              <h3 className="text-xl font-semibold text-primary-coral mb-4">Phase Finale</h3>
              {renderJourneyPhase('final')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}