'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, CheckSquare, Loader2, PlusCircle, Square, User, X, LogOut } from 'lucide-react';
import { getAuth, User as FirebaseUser, signOut } from 'firebase/auth';
import { toast } from 'sonner';
import { format, isAfter, isBefore } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { CalendlyModal, SessionType } from '@/components/dashboard/CalendlyModal';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { InvitePartnerForm } from '@/components/InvitePartnerForm';
import { UserProfileForm } from '@/components/UserProfileForm';
import { ZenClickButton } from '@/components/ZenClickButton';
import { app } from '@/lib/firebase';
import { coupleTherapyJourney, getPhasePartnerEvents, TherapyJourneyEvent } from '@/lib/coupleTherapyJourney';
import { createOrUpdateUser, createOrUpdateUserWithFields, getPartnerProfile, getUserById, User as UserProfile, SessionDetails } from '@/lib/userService';
import { getCalendlyEventDetails, extractEventIdFromUri } from '@/lib/calendly';
import { RecentlyScheduledEvent } from '@/components/dashboard/RecentlyScheduledEvent';
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, onSnapshot, query, Timestamp, updateDoc, where, increment, deleteDoc, orderBy, limit } from 'firebase/firestore';

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
  const [lastScheduledEvent, setLastScheduledEvent] = useState<{ 
    sessionId: string;
    eventUri: string; 
    scheduledDate: string;
    formattedDate?: string;
  } | null>(null);
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
    if (!event.dependsOn) return true;
    
    if (Array.isArray(event.dependsOn)) {
      return event.dependsOn.every(dep => isSessionCompleted(dep));
    }
    
    return isSessionCompleted(event.dependsOn);
  };

  const getSessionDateConstraints = (event: TherapyJourneyEvent) => {
    const minDate = new Date();
    
    if (event.dependsOn && event.daysOffset) {
      const dependentId = Array.isArray(event.dependsOn) ? event.dependsOn[0] : event.dependsOn;
      
      if (sessionDates[dependentId]) {
        const dependentDate = new Date(sessionDates[dependentId]);
        minDate.setDate(dependentDate.getDate() + event.daysOffset);
      }
    }

    const maxDate = new Date(minDate);
    maxDate.setDate(maxDate.getDate() + 30); // Allow booking up to 30 days after min date

    return { minDate, maxDate };
  };

  const handleSessionClick = (event: TherapyJourneyEvent) => {
    if (!isSessionAvailable(event)) {
      toast.error("Veuillez d'abord compléter les étapes précédentes");
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
    if (!eventData) {
      console.error('No event data received from Calendly');
      return;
    }
    
    // Log the entire event data for debugging
    console.log('Full event data from Calendly:', JSON.stringify(eventData, null, 2));
    
    if (selectedSession) {
      // Set session date from Calendly event
      let scheduledDate: Date | null = null;
      let eventUri: string | null = null;
      
      // Check for event URI from enhanced data structure in the CalendlyModal
      if (eventData.eventUri) {
        eventUri = eventData.eventUri;
        console.log('Found eventUri at top level:', eventUri);
      }
      // Check different possible data structures from Calendly
      else if (eventData.payload?.event?.uri) {
        eventUri = eventData.payload.event.uri;
        console.log('Found event URI in payload.event.uri:', eventUri);
      } 
      else if (eventData.payload?.invitee?.scheduled_event?.uri) {
        eventUri = eventData.payload.invitee.scheduled_event.uri;
        console.log('Found event URI in payload.invitee.scheduled_event.uri:', eventUri);
      }
      // Original API format check
      else if (eventData.event?.uri) {
        eventUri = eventData.event.uri;
        console.log('Found event URI in event.uri:', eventUri);
      }
      
      console.log('Final extracted event URI:', eventUri);
      
      if (!eventUri) {
        console.error('Could not extract event URI from Calendly data');
        toast.error('Erreur lors de la récupération des détails du rendez-vous. Veuillez contacter le support.');
        return;
      }
      
      try {
        // Fetch detailed event information from Calendly API using the URI
        console.log('Fetching detailed event information from URI:', eventUri);
        const eventDetails = await getCalendlyEventDetails(eventUri);
        
        if (!eventDetails) {
          console.error('Failed to fetch event details');
          toast.error('Erreur lors de la récupération des détails du rendez-vous.');
          return;
        }
        
        console.log('Successfully retrieved event details:', eventDetails);
        
        // Extract and format date information
        scheduledDate = new Date(eventDetails.startTime);
        const dateString = scheduledDate.toISOString();
        
        // Create session details object with all available information
        const sessionDetails: SessionDetails = {
          date: dateString,
          startTime: eventDetails.startTime,
          endTime: eventDetails.endTime,
          formattedDateTime: eventDetails.formattedDateTime,
          calendarEvent: eventUri,
          location: eventDetails.location,
          sessionType: selectedSession.sessionType || 'unknown',
          status: 'scheduled',
        };
        
        // Add invitee information if available
        if (eventDetails.invitee) {
          sessionDetails.inviteeEmail = eventDetails.invitee.email;
          sessionDetails.inviteeName = eventDetails.invitee.name;
        }
        
        // Update session dates in state
        setSessionDates(prev => ({ 
          ...prev, 
          [selectedSession.id]: dateString
        }));
        
        // Set the last scheduled event details for display
        setLastScheduledEvent({
          sessionId: selectedSession.id,
          eventUri: eventUri,
          scheduledDate: dateString,
          formattedDate: eventDetails.formattedDateTime
        });
        
        // Show a success message with the scheduled date
        toast.success(`Séance programmée pour le ${eventDetails.formattedDateTime}`);
        
        // Store the session details
        console.log('Storing session details:', sessionDetails);
        
        // Update Firestore with session details
        if (user) {
          try {
            const db = getFirestore(app);
            const userRef = doc(db, 'users', user.uid);
            
            // Update the user document with session details
            await updateDoc(userRef, {
              [`sessionDetails.${selectedSession.id}`]: sessionDetails,
              [`sessionDates.${selectedSession.id}`]: dateString,
              updatedAt: Timestamp.now()
            });
            
            console.log('Session details saved to Firestore');
          } catch (error) {
            console.error('Error updating user document with session details:', error);
            toast.error('Erreur lors de l\'enregistrement des détails de la séance.');
          }
        }
        
      } catch (error) {
        console.error('Error processing Calendly event:', error);
        toast.error('Erreur lors du traitement des données du rendez-vous.');
      }
    } else {
      console.error('No selected session when appointment was scheduled');
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

    return (
      <div className="space-y-3">
        {events.map((event) => {
          const isComplete = isSessionCompleted(event.id);
          const isAvailable = isSessionAvailable(event);
          
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
          const showBookingButton = phase === 'initial' || phase === 'final' || (phase === 'individual' && partner === 'partner1');
          
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
                    {partner === 'partner1' && !isComplete && isAvailable && (
                      <span className="block text-xs text-[rgb(247_237_226_)] mt-1">
                        Prendre rendez-vous {event.title.split(' - ')[0]}
                      </span>
                    )}
                  </div>
                  {dateStr && (
                    <div className="text-sm mt-1 flex items-center gap-1.5 text-[rgb(247_237_226_)] font-medium bg-[rgb(247_237_226_)]/20 px-2 py-1 rounded-md w-fit">
                      <Calendar className="w-4 h-4" />
                      {dateStr}
                    </div>
                  )}
                </div>
              </div>
              
              {showBookingButton && !isComplete && isAvailable && (
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
          
          {/* Show recently scheduled event if available */}
          {lastScheduledEvent && (
            <RecentlyScheduledEvent 
              eventUri={lastScheduledEvent.eventUri}
              sessionTitle={
                coupleTherapyJourney.find(event => event.id === lastScheduledEvent.sessionId)?.title || 'Séance'
              }
              onDismiss={() => setLastScheduledEvent(null)}
            />
          )}
          
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
          <CalendlyModal
            isOpen={isCalendlyModalOpen}
            onClose={() => {
              setIsCalendlyModalOpen(false);
              setSelectedSession(null);
            }}
            sessionType={selectedSession.sessionType!}
            onEventScheduled={handleAppointmentScheduled}
            userEmail={userProfile?.email}
            {...getSessionDateConstraints(selectedSession)}
          />
        )}
      </div>
    </div>
  );
}