'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, CheckSquare, Loader2, PlusCircle, Square, User, X, LogOut } from 'lucide-react';
import { getAuth, User as FirebaseUser, signOut } from 'firebase/auth';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { CalendlyModal, SessionType } from '@/components/dashboard/CalendlyModal';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { InvitePartnerForm } from '@/components/InvitePartnerForm';
import { UserProfileForm } from '@/components/UserProfileForm';
import { ZenClickButton } from '@/components/ZenClickButton';
import { app } from '@/lib/firebase';
import { coupleTherapyJourney, getPhasePartnerEvents, TherapyJourneyEvent } from '@/lib/coupleTherapyJourney';
import { createOrUpdateUser, createOrUpdateUserWithFields, getPartnerProfile, getUserById, User as UserProfile, SessionDetails } from '@/lib/userService';

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
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const [hasAppointment, setHasAppointment] = useState(false);
  const [selectedSession, setSelectedSession] = useState<TherapyJourneyEvent | null>(null);
  const [completedSessions, setCompletedSessions] = useState<Set<string>>(new Set());
  const [sessionDates, setSessionDates] = useState<Record<string, string>>({});
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
      
      console.log('Loaded user profile data:', { 
        completedSessions: userProfile.completedSessions, 
        sessionDates: userProfile.sessionDates 
      });
    }
  }, [userProfile]);

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
      return event.dependsOn.every(dep => completedSessions.has(dep));
    }
    
    return completedSessions.has(event.dependsOn);
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
    setIsCalendlyOpen(true);
  };

  const handleAppointmentScheduled = (eventData?: any) => {
    if (selectedSession) {
      toast.success('Rendez-vous programmé avec succès');
      
      // Mark as completed and set date
      setCompletedSessions(prev => new Set([...prev, selectedSession.id]));
      
      // Extract Calendly event details if available
      const calendlyEvent = eventData?.data?.event || {};
      
      // Log the Calendly event data for debugging
      console.log('Calendly event data:', calendlyEvent);
      
      // Set session date (use event date from Calendly if available, or current date as fallback)
      const scheduledDate = calendlyEvent?.start_time 
        ? new Date(calendlyEvent.start_time) 
        : new Date();
      
      console.log('Parsed scheduled date:', scheduledDate);
      
      // Store the date string in state and for Firestore
      const dateString = scheduledDate.toISOString();
      console.log('ISO date string to store:', dateString);
      
      // Create detailed session information object
      const sessionDetails: SessionDetails = {
        date: dateString,
        sessionType: selectedSession.sessionType || 'unknown',
        status: 'scheduled',
      };
      
      // Add additional details if available from Calendly
      if (calendlyEvent) {
        if (calendlyEvent.start_time) sessionDetails.startTime = new Date(calendlyEvent.start_time).toISOString();
        if (calendlyEvent.end_time) sessionDetails.endTime = new Date(calendlyEvent.end_time).toISOString();
        if (calendlyEvent.duration) sessionDetails.duration = calendlyEvent.duration;
        if (calendlyEvent.location) sessionDetails.location = calendlyEvent.location?.join(', ') || calendlyEvent.location;
        if (calendlyEvent.uri) sessionDetails.calendarEvent = calendlyEvent.uri;
        if (eventData?.data?.invitee?.email) sessionDetails.inviteeEmail = eventData.data.invitee.email;
        if (eventData?.data?.invitee?.text_reminder_number) sessionDetails.textReminderNumber = eventData.data.invitee.text_reminder_number;
        if (calendlyEvent.cancellation_url) sessionDetails.cancellationUrl = calendlyEvent.cancellation_url;
        if (calendlyEvent.reschedule_url) sessionDetails.rescheduleUrl = calendlyEvent.reschedule_url;
      }
        
      setSessionDates(prev => ({ 
        ...prev, 
        [selectedSession.id]: dateString
      }));
      
      // Log what we're storing
      console.log(`Storing session date for ${selectedSession.id}:`, dateString);
      
      // Store detailed session data
      const updatedSessionDetails = {
        ...userProfile?.sessionDetails || {},
        [selectedSession.id]: sessionDetails
      };
      
      // Save to Firestore
      if (userProfile) {
        const updatedProfile = {
          ...userProfile,
          completedSessions: [...Array.from(completedSessions), selectedSession.id],
          sessionDates: {
            ...userProfile.sessionDates,
            [selectedSession.id]: dateString
          },
          // Add the detailed session information
          sessionDetails: updatedSessionDetails
        };
        
        createOrUpdateUser(updatedProfile)
          .catch(error => {
            console.error('Error updating user profile:', error);
            toast.error('Une erreur est survenue lors de la mise à jour de votre profil');
          });
      }
      
      // Reset states
      setSelectedSession(null);
    }
  };

  // Render journey timeline by phase
  const renderJourneyPhase = (phase: 'initial' | 'individual' | 'final', partner?: 'partner1' | 'partner2') => {
    const events = getPhasePartnerEvents(phase, partner);

    return (
      <div className="space-y-3">
        {events.map((event) => {
          const isComplete = completedSessions.has(event.id);
          const isAvailable = isSessionAvailable(event);
          
          // Improved date handling - make sure to parse the string to a Date object
          const dateStr = sessionDates[event.id] 
            ? new Date(sessionDates[event.id]).toLocaleDateString('fr-FR', { 
                day: 'numeric', 
                month: 'long',
                year: 'numeric' 
              }) 
            : null;
            
          // Log the date for debugging
          if (sessionDates[event.id]) {
            console.log(`Event ${event.id} date from Firestore:`, sessionDates[event.id]);
            console.log(`Event ${event.id} formatted date:`, dateStr);
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
                        ? 'text-primary-cream cursor-pointer hover:text-primary-coral' 
                        : 'text-primary-cream/30'
                  }`}
                  onClick={() => {
                    if (!isComplete && isAvailable) {
                      handleSessionClick(event);
                    }
                  }}
                >
                  {isComplete ? (
                    <CheckSquare className="w-5 h-5" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </div>
                <div className={isAvailable ? 'text-primary-cream' : 'text-primary-cream/30'}>
                  <div className="font-medium">
                    {event.title}
                    {partner === 'partner1' && !isComplete && isAvailable && (
                      <span className="block text-xs text-primary-coral mt-1">
                        Prendre rendez-vous {event.title.split(' - ')[0]}
                      </span>
                    )}
                  </div>
                  {dateStr && (
                    <div className="text-xs flex items-center gap-1 text-primary-coral">
                      <Calendar className="w-3 h-3" />
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
                    className="text-xs h-8 border-primary-coral/30 text-primary-coral hover:bg-primary-coral/10"
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
        <div className="mt-8 space-y-8">
          <h2 className="text-2xl font-bold text-primary-coral">Votre parcours thérapeutique</h2>
          
          {/* Initial Phase */}
          <div>
            <h3 className="text-xl font-semibold text-primary-cream/90 mb-4">Phase Initiale</h3>
            {renderJourneyPhase('initial')}
          </div>

          {/* Individual Phases */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Partner 1 Journey */}
            <div>
              <h3 className="text-xl font-semibold text-primary-cream/90 mb-4">Parcours Individuel - Partenaire 1</h3>
              {renderJourneyPhase('individual', 'partner1')}
            </div>
            
            {/* Partner 2 Journey */}
            <div>
              <h3 className="text-xl font-semibold text-primary-cream/90 mb-4">Parcours Individuel - Partenaire 2</h3>
              {renderJourneyPhase('individual', 'partner2')}
            </div>
          </div>

          {/* Final Phase */}
          <div>
            <h3 className="text-xl font-semibold text-primary-cream/90 mb-4">Phase Finale</h3>
            {renderJourneyPhase('final')}
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
            isOpen={isCalendlyOpen}
            onClose={() => {
              setIsCalendlyOpen(false);
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