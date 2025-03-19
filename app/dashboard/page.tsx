'use client';

import { format, isAfter, isBefore } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getAuth, signOut, User as FirebaseUser } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, getDoc, getFirestore, increment, limit, onSnapshot, orderBy, query, Timestamp, updateDoc, where } from 'firebase/firestore';
import { Calendar, CheckSquare, Edit, Loader2, LogOut, PlusCircle, Square, User, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { CalendlyModal, SessionType } from '@/components/dashboard/CalendlyModal';
import { InvitePartnerForm } from '@/components/InvitePartnerForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserProfileForm } from '@/components/UserProfileForm';
import { ZenClickButton } from '@/components/ZenClickButton';
import { extractEventIdFromUri, getCalendlyEventDetails } from '@/lib/calendly';
import { coupleTherapyJourney, getPhasePartnerEvents, TherapyJourneyEvent } from '@/lib/coupleTherapyJourney';
import { app } from '@/lib/firebase';
import { createOrUpdateUser, createOrUpdateUserWithFields, getPartnerProfile, getUserById, SessionDetails, User as UserProfile } from '@/lib/userService';

export default function DashboardPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [partnerProfile, setPartnerProfile] = useState<UserProfile | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({
    evaluation: false,
    questionnaire: false,
    amoureux: false,
    eros: false,
    appointment: false
  });
  const [isCalendlyModalOpen, setIsCalendlyModalOpen] = useState(false);
  const [hasAppointment, setHasAppointment] = useState(false);
  const [selectedSession, setSelectedSession] = useState<TherapyJourneyEvent | null>(null);
  const [completedSessions, setCompletedSessions] = useState<Set<string>>(new Set());
  const [sessionDates, setSessionDates] = useState<Record<string, string>>({});
  const [invalidDates, setInvalidDates] = useState<Set<string>>(new Set());
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
          if (!user) return;

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
        ...getPhasePartnerEvents('initial'),
        ...getPhasePartnerEvents('individual', 'partner1'),
        ...getPhasePartnerEvents('individual', 'partner2'),
        ...getPhasePartnerEvents('final')
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
      'partner1_session_2': 'partner1_session_1',
      'partner1_session_3': 'partner1_session_2',
      'partner2_session_1': 'initial_session',
      'partner2_session_2': 'partner2_session_1',
      'partner2_session_3': 'partner2_session_2',
      'final_session': 'partner1_session_3' // Final depends on last partner1 session
    };

    // If there's no dependency for this session, it's always valid
    if (!sessionDependencyMap[sessionId]) {
      return true;
    }

    // Get the previous session date
    const previousSessionId = sessionDependencyMap[sessionId];
    const previousSessionDateStr = sessionDates[previousSessionId];

    // If previous session doesn't have a date yet, this date is invalid
    if (!previousSessionDateStr) {
      return false;
    }

    try {
      const currentDate = new Date(dateStr);
      const previousDate = new Date(previousSessionDateStr);

      // Calculate the difference in days
      const diffTime = currentDate.getTime() - previousDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Debug log with detailed info
      console.log(`[DATE CHECK] ${sessionId}: ${new Date(dateStr).toLocaleDateString('fr-FR')} ` +
                  `vs previous ${previousSessionId}: ${new Date(previousSessionDateStr).toLocaleDateString('fr-FR')} ` + 
                  `= ${diffDays} days apart`);

      // Check if the difference is at least 28 days (4 weeks)
      return diffDays >= 28;
    } catch (error) {
      console.error(`Error validating date for session ${sessionId}:`, error);
      return false;
    }
  }, [sessionDates]);

  // Debugging for session dates
  useEffect(() => {
    console.log('------- DEBUG SESSION DATES -------');
    console.log('All session dates:', sessionDates);
    console.log('Invalid dates set:', Array.from(invalidDates));
    
    // Check if any dates need validity checks but aren't being validated
    Object.entries(sessionDates).forEach(([eventId, dateStr]) => {
      // Skip initial session
      if (eventId !== 'initial_session') {
        const isValid = isDateValid(eventId, dateStr);
        console.log(`* Date validity check for ${eventId}: ${dateStr} => ${isValid ? 'VALID' : 'INVALID'}`);
      }
    });
    
    console.log('------- END DEBUG -------');
  }, [sessionDates, invalidDates, isDateValid]);

  // Validate all existing dates when session dates change
  useEffect(() => {
    const newInvalidDates = new Set<string>();
    
    // Log all session dates for debugging
    console.log('All session dates to validate:', sessionDates);
    
    // Force checking each individual date, even if not in sessionDates yet
    const allSessionIds = [
      'partner1_session_1', 
      'partner1_session_2', 
      'partner1_session_3',
      'partner2_session_1', 
      'partner2_session_2', 
      'partner2_session_3',
      'final_session'
    ];
    
    // Check all session dates
    allSessionIds.forEach(sessionId => {
      // Skip if this session doesn't have a date
      if (!sessionDates[sessionId]) return;
      
      // Skip the initial session as it has no "previous" session
      if (sessionId === 'initial_session') return;
      
      const dateStr = sessionDates[sessionId];
      const isValid = isDateValid(sessionId, dateStr);
      
      console.log(`Validating ${sessionId}: ${dateStr} => ${isValid ? 'VALID' : 'INVALID'}`);
      
      if (!isValid) {
        newInvalidDates.add(sessionId);
      }
    });
    
    // Log the final set of invalid dates
    console.log('Final invalid dates:', Array.from(newInvalidDates));
    
    // Update invalid dates state
    setInvalidDates(newInvalidDates);
  }, [sessionDates, isDateValid]);

  const handleUpdateProfile = async (formData: Partial<UserProfile>) => {
    if (!user) return;

    try {
      setIsUpdatingProfile(true);

      const userData = {
        ...formData,
        email: user.email || formData.email || ''
      };

      const updatedProfile = await createOrUpdateUserWithFields(user.uid, userData);
      setUserProfile(updatedProfile);
      setIsEditingProfile(false);
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      console.error('Error updating user profile:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleInvitePartner = async (email: string) => {
    if (!userProfile || !user) return;

    try {
      setIsUpdatingProfile(true);
      
      // Update the userProfile with the partner email
      const updatedUser = await createOrUpdateUserWithFields(user.uid, {
        ...userProfile,
        partnerEmail: email
      });
      
      setUserProfile(updatedUser);
      toast.success(`Invitation envoyée à ${email}`);
      setIsInviting(false);
      
      // In a real scenario, this would trigger a cloud function to send an email
      // and create a partner account, then link the two accounts
    } catch (error) {
      console.error('Error inviting partner:', error);
      toast.error("Une erreur est survenue lors de l'envoi de l'invitation");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePhotoClick = () => {
    setIsEditingProfile(true);
  };

  const handleDeletePhoto = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) return;

    try {
      setIsUpdatingProfile(true);

      const { photo, ...userData } = userProfile || {};
      
      const updatedProfile = await createOrUpdateUserWithFields(user.uid, userData);
      setUserProfile(updatedProfile);
      toast.success('Photo supprimée avec succès');
    } catch (error) {
      console.error('Error deleting user photo:', error);
      toast.error('Erreur lors de la suppression de la photo');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const toggleCheckbox = (id: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Therapy Journey Logic
  const isSessionAvailable = (event: TherapyJourneyEvent) => {
    // First check if there are any invalid dates in previous sessions
    if (event.id !== 'initial_session' && hasPreviousInvalidDates(event.id)) {
      return false;
    }
    
    // Special case for first individual session for partner 1
    // Make it available immediately after initial session is completed OR has a date set
    if (event.id === 'partner1_session_1') {
      return (isSessionCompleted('initial_session') || !!sessionDates['initial_session']) && 
             !invalidDates.has('initial_session');
    }
    
    if (!event.dependsOn) return true;
    
    if (Array.isArray(event.dependsOn)) {
      return event.dependsOn.every(dep => 
        (isSessionCompleted(dep) || !!sessionDates[dep]) && !invalidDates.has(dep)
      );
    }
    
    return (
      (isSessionCompleted(event.dependsOn) || !!sessionDates[event.dependsOn]) && 
      !invalidDates.has(event.dependsOn)
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
      if (invalidDates.has(prevSessionId)) {
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
        const invalidDeps = event.dependsOn.filter(dep => invalidDates.has(dep));
        if (invalidDeps.length > 0) {
          return "Une ou plusieurs séances précédentes ne respectent pas l'écart de 4 semaines requis.";
        }
      } 
      // Handle single dependency
      else {
        if (!isSessionCompleted(event.dependsOn) && !sessionDates[event.dependsOn]) {
          return "Veuillez d'abord compléter les étapes précédentes.";
        }
        
        if (invalidDates.has(event.dependsOn)) {
          return "La séance précédente ne respecte pas l'écart de 4 semaines requis.";
        }
      }
    }
    
    return "";
  };

  const handleSessionClick = (event: TherapyJourneyEvent) => {
    // If this is a session that already has a date and we're trying to reschedule
    if (sessionDates[event.id]) {
      // If we're rescheduling an invalid date, let it proceed
      if (invalidDates.has(event.id)) {
        console.log(`Manually rescheduling invalid session: ${event.id}`);
        
        // If the session has a reschedule URL, use it
        if (userProfile?.sessionDetails?.[event.id]?.rescheduleUrl) {
          window.open(userProfile.sessionDetails[event.id].rescheduleUrl, '_blank');
          return;
        }
        
        // Otherwise, proceed with normal scheduling to create a new appointment
        // We'll handle the old one later (should be cancelled or replaced)
      } else {
        // If the date is valid, show the normal error
        toast.error("Cette séance est déjà programmée. Veuillez l'annuler avant d'en réserver une nouvelle.");
        return;
      }
    }
    
    // Normal availability check
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

  const handleAppointmentScheduled = async (eventData?: any) => {
    // If no event data or no session selected, do nothing
    if (!eventData || !selectedSession) {
      console.error('No event data or session selected');
      return;
    }
    
    try {
      // Extract event URI from event data
      const eventUri = eventData.eventUri;
      
      if (!eventUri) {
        console.error('No event URI found in event data');
        return;
      }
      
      console.log('Appointment scheduled:', eventData);
      console.log('Event URI:', eventUri);
      
      // Get event details from Calendly API
      const eventDetails = await getCalendlyEventDetails(eventUri);
      if (!eventDetails) {
        console.error('Failed to fetch event details from Calendly API');
        return;
      }
      console.log('Event details:', eventDetails);
      
      if (eventDetails.startTime) {
        // Convert ISO date to Date object
        const dateString = eventDetails.startTime;
        
        // Check if the date is valid (at least 4 weeks after the previous session)
        const isValid = isDateValid(selectedSession.id, dateString);
        
        // If not valid, add to invalid dates set
        if (!isValid) {
          setInvalidDates(prev => new Set([...prev, selectedSession.id]));
          console.warn(`Warning: The session date for ${selectedSession.id} is less than 4 weeks after its previous session`);
        } else {
          // If valid and previously invalid, remove from invalid dates
          if (invalidDates.has(selectedSession.id)) {
            const newInvalidDates = new Set(invalidDates);
            newInvalidDates.delete(selectedSession.id);
            setInvalidDates(newInvalidDates);
          }
        }

        // Create session details object
        const sessionDetails: SessionDetails = {
          date: dateString,
          formattedDateTime: eventDetails.formattedDateTime,
          location: eventDetails.location,
          calendarEvent: eventUri,
          sessionType: selectedSession.sessionType || 'unknown',
          status: 'scheduled',
        };
        
        // Add invitee information if available
        if (eventDetails.invitee) {
          sessionDetails.inviteeEmail = eventDetails.invitee.email;
          sessionDetails.inviteeName = eventDetails.invitee.name;
          
          // Add cancellation and reschedule URLs if available
          if (eventDetails.invitee.cancel_url) {
            sessionDetails.cancellationUrl = eventDetails.invitee.cancel_url;
          }
          
          if (eventDetails.invitee.reschedule_url) {
            sessionDetails.rescheduleUrl = eventDetails.invitee.reschedule_url;
            console.log(`Saved reschedule URL for ${selectedSession.id}:`, eventDetails.invitee.reschedule_url);
          } else {
            console.warn(`No reschedule URL found for ${selectedSession.id} in event details:`, eventDetails);
          }
        }
        
        // Update session dates in state
        setSessionDates(prev => ({ 
          ...prev, 
          [selectedSession.id]: dateString
        }));
        
        // Show a success message with the scheduled date
        toast.success(`Séance programmée pour le ${eventDetails.formattedDateTime}`);
        
        // Store the session details
        console.log('Storing session details:', sessionDetails);
        
        // Update Firestore with session details
        if (user) {
          const db = getFirestore(app);
          const userRef = doc(db, 'users', user.uid);
          
          // Update the user document with session details
          await updateDoc(userRef, {
            [`sessionDetails.${selectedSession.id}`]: sessionDetails,
            [`sessionDates.${selectedSession.id}`]: dateString,
            updatedAt: Timestamp.now()
          });
          
          console.log(`Updated Firestore with session details for ${selectedSession.id}`);
          
          // Check if this is the initial session and emit a notification event
          if (selectedSession.id === 'initial_session') {
            // Additional processing for initial session
            console.log('Initial session booked - emitting notification');
          }
        }
      }
    } catch (error) {
      console.error('Error handling appointment scheduling:', error);
      toast.error('Une erreur est survenue lors de la programmation du rendez-vous.');
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
    const events = getPhasePartnerEvents(phase, partner);

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
                  className={`p-1 rounded ${
                    isComplete 
                      ? 'text-emerald-500' 
                      : isAvailable 
                        ? 'text-primary-cream' 
                        : 'text-primary-cream/30'
                  }`}
                >
                  {isComplete ? (
                    <CheckSquare className="w-5 h-5" />
                  ) : (
                    <Square className="w-5 h-5" />
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
                        ${invalidDates.has(event.id) 
                          ? 'text-red-400 font-medium bg-red-900/30' 
                          : 'text-green-400 font-medium bg-green-900/30'
                        }`}
                    >
                      <Calendar className="w-4 h-4" />
                      <span>{dateStr}</span>
                      {invalidDates.has(event.id) && (
                        <span className="text-xs ml-1">(moins de 4 semaines)</span>
                      )}
                      
                      {/* Add edit icon for valid dates */}
                      {!invalidDates.has(event.id) && (
                        <>
                          {userProfile?.sessionDetails?.[event.id]?.rescheduleUrl ? (
                            <a
                              href={userProfile.sessionDetails[event.id].rescheduleUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 opacity-70 hover:opacity-100 transition-opacity"
                              title="Reprogrammer cette séance"
                            >
                              <Edit className="w-3 h-3" />
                            </a>
                          ) : (
                            <button
                              onClick={() => handleSessionClick(event)}
                              className="ml-2 opacity-70 hover:opacity-100 transition-opacity"
                              title="Reprogrammer cette séance"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                          )}
                        </>
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

              {/* Show reschedule button only for invalid dates */}
              {invalidDates.has(event.id) && (
                <div className="ml-8 mt-2">
                  {userProfile?.sessionDetails?.[event.id]?.rescheduleUrl ? (
                    <a
                      href={userProfile.sessionDetails[event.id].rescheduleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs h-8 px-4 py-2 rounded-md
                        border border-red-400/40 text-red-300 bg-transparent
                        hover:bg-red-400/10 hover:text-red-200 transition-colors"
                    >
                      <Edit className="w-3 h-3 mr-2" />
                      Reprogrammer cette séance
                    </a>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs h-8 border-red-400/40 text-red-300 hover:bg-red-400/10 hover:text-red-200"
                      onClick={() => handleSessionClick(event)}
                    >
                      <Edit className="w-3 h-3 mr-2" />
                      Reprogrammer cette séance
                    </Button>
                  )}
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
    <div className="min-h-screen bg-primary-forest text-primary-cream">
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
              <div className="relative">
                {userProfile?.photo && !isUpdatingProfile && (
                  <button
                    type="button"
                    onClick={handleDeletePhoto}
                    className="absolute -top-2 -right-2 z-10 bg-black/70 rounded-full p-1 hover:bg-black/90 transition-colors"
                    aria-label="Delete photo"
                  >
                    <X className="w-3.5 h-3.5 text-white" />
                  </button>
                )}
                <div
                  className="relative w-16 h-16 rounded-full overflow-hidden bg-primary-cream/20 cursor-pointer"
                  onClick={handlePhotoClick}
                >
                  {isUpdatingProfile ? (
                    <div className="absolute inset-0 flex items-center justify-center text-primary-cream/60">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : userProfile?.photo ? (
                    <Image
                      src={userProfile.photo}
                      alt="Profile"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-cream/60 text-center">
                      <User className="w-8 h-8" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-primary-cream">{userProfile?.prenom || 'Partenaire 1'}</h3>
                <p className="text-sm text-primary-cream/60">{user?.email}</p>
              </div>
              <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-primary-cream/20 text-primary-cream hover:bg-primary-cream/10 hover:text-primary-coral"
                    disabled={isUpdatingProfile}
                  >
                    {isUpdatingProfile ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        MISE À JOUR...
                      </>
                    ) : 'MODIFIER'}</Button>
                </DialogTrigger>
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
                      {partnerProfile.prenom} {partnerProfile.nom}
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

        {/* Calendly Modal */}
        {selectedSession && (
          <>
            {/* Debug log for minDate */}
            {(() => {
              const { minDate } = getSessionDateConstraints(selectedSession);
              console.log(`Passing minDate to CalendlyModal for ${selectedSession.id}:`, minDate.toISOString());
              return null;
            })()}
            <CalendlyModal
              isOpen={isCalendlyModalOpen}
              onClose={() => {
                setIsCalendlyModalOpen(false);
                setSelectedSession(null);
              }}
              sessionType={selectedSession?.sessionType || 'initial'}
              onAppointmentScheduled={handleAppointmentScheduled}
              minDate={selectedSession ? getSessionDateConstraints(selectedSession).minDate : undefined}
              maxDate={selectedSession ? getSessionDateConstraints(selectedSession).maxDate : undefined}
              userEmail={userProfile?.email}
            />
          </>
        )}
      </div>
    </div>
  );
}