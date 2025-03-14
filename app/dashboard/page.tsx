'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User as FirebaseUser, getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CheckSquare, Square, Loader2, PlusCircle, X, User } from 'lucide-react';
import Link from 'next/link';
import { ZenClickButton } from '@/components/ZenClickButton';
import { getUserById, createOrUpdateUser, getPartnerProfile, User as UserProfile } from '@/lib/userService';
import { UserProfileForm } from '@/components/UserProfileForm';
import { InvitePartnerForm } from '@/components/InvitePartnerForm';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { OffersPanel } from '@/components/OffersPanel';

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
    appointment: false,
    partner_evaluation: false,
    partner_questionnaire: false,
    partner_amoureux: false,
    partner_eros: false
  });
  const [offersCount, setOffersCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        
        async function fetchUserProfile() {
          if (!user) return;
          
          try {
            console.log('Fetching user profile for ID:', user.uid);
            const profileData = await getUserById(user.uid);
            console.log('User profile data:', profileData);
            setUserProfile(profileData);

            if (profileData?.partnerId) {
              console.log('Fetching partner profile for ID:', profileData.partnerId);
              const partnerData = await getPartnerProfile(profileData.partnerId);
              console.log('Partner data:', partnerData);
              if (partnerData) {
                setPartnerProfile(partnerData);
              } else {
                console.log('No partner data found');
                // If no partner data found but we have partner email, create a minimal partner profile
                if (profileData.partnerEmail) {
                  setPartnerProfile({
                    id: profileData.partnerId,
                    email: profileData.partnerEmail,
                    role: 'partner'
                  });
                }
              }
            } else {
              // Clear partner profile if no partner ID
              setPartnerProfile(null);
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

  const handleUpdateProfile = async (formData: Partial<UserProfile>) => {
    if (!user) return;
    
    try {
      setIsUpdatingProfile(true);
      
      // Clean up the form data to remove undefined values
      const cleanedFormData = Object.entries(formData).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);
      
      const userData = {
        ...cleanedFormData,
        email: user.email || cleanedFormData.email || ''
      };
      
      const updatedProfile = await createOrUpdateUser(user.uid, userData);
      setUserProfile(updatedProfile);

      // If partner email changed, refetch partner profile
      if (updatedProfile.partnerId && (!partnerProfile || partnerProfile.id !== updatedProfile.partnerId)) {
        const partnerData = await getPartnerProfile(updatedProfile.partnerId);
        if (partnerData) {
          setPartnerProfile(partnerData);
        }
      }

      setIsEditingProfile(false);
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      console.error('Error updating user profile:', error);
      toast.error('Erreur lors de la mise à jour du profil');
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
      
      const userData = {
        ...userProfile,
        photo: undefined
      };
      
      const updatedProfile = await createOrUpdateUser(user.uid, userData);
      setUserProfile(updatedProfile);
      toast.success('Photo supprimée avec succès');
    } catch (error) {
      console.error('Error deleting user photo:', error);
      toast.error('Erreur lors de la suppression de la photo');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const toggleCheckbox = (key: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));

    // If this is a partner step, check if all partner steps are completed
    if (key.startsWith('partner_') && !checkedItems[key]) {
      const allPartnerStepsCompleted = ['evaluation', 'amoureux', 'eros']
        .every(step => checkedItems[`partner_${step}`] || step === key.replace('partner_', ''));
      
      if (allPartnerStepsCompleted) {
        toast.success('Votre partenaire a complété toutes les étapes !');
      }
    }
    
    // If this is a user step, check if all user steps are completed
    if (!key.startsWith('partner_') && !checkedItems[key]) {
      const allUserStepsCompleted = ['evaluation', 'amoureux', 'eros']
        .every(step => checkedItems[step] || step === key);
      
      if (allUserStepsCompleted) {
        toast.success('Vous avez complété toutes vos étapes !');
      }
    }
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
          <div>
            <ZenClickButton />
          </div>
        </div>

        {/* Couple Profile Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Profile Box 1 */}
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
                    <img 
                      src={userProfile.photo} 
                      alt="Profile" 
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

          {/* Profile Box 2 */}
          <div className="rounded-lg border border-primary-cream/20 bg-primary-cream/10 p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-primary-cream/20">
                  {partnerProfile?.photo ? (
                    <img 
                      src={partnerProfile.photo} 
                      alt="Partner Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-primary-cream/60">
                      <User className="w-8 h-8" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1">
                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-5 w-32 bg-primary-cream/10 rounded mb-2"></div>
                    <div className="h-4 w-24 bg-primary-cream/10 rounded"></div>
                  </div>
                ) : userProfile?.partnerId ? (
                  <>
                    <h3 className="text-lg font-medium text-primary-cream">
                      {partnerProfile?.prenom ? `${partnerProfile.prenom} ${partnerProfile.nom || ''}` : 'Partenaire connecté'}
                    </h3>
                    <p className="text-sm text-primary-cream/60">
                      {partnerProfile?.email || userProfile.partnerEmail || 'Email non disponible'}
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-medium text-primary-cream">Votre Partenaire</h3>
                    <p className="text-sm text-primary-cream/60">Ajoutez votre partenaire ici et commencez votre parcours</p>
                  </>
                )}
              </div>
              {!userProfile?.partnerId && (
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

        <Dialog open={isInviting} onOpenChange={setIsInviting}>
          <DialogContent className="bg-primary-forest border-primary-cream/20 text-primary-cream">
            <DialogHeader>
              <DialogTitle className="text-primary-coral">Inviter votre partenaire</DialogTitle>
              <DialogDescription className="text-primary-cream/60">
                Envoyez une invitation à votre partenaire pour commencer votre parcours ensemble
              </DialogDescription>
            </DialogHeader>
            <InvitePartnerForm onClose={() => setIsInviting(false)} />
          </DialogContent>
        </Dialog>

        {/* Checklist Section */}
        <div className="rounded-lg border border-primary-cream/20 bg-primary-cream/10 p-6 mb-6">
          <h2 className="text-xl font-semibold text-primary-coral mb-6 text-center">Votre parcours</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Your Steps */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-primary-cream mb-3">Vos étapes</h3>
              <Link href="/evaluation-handicap-relationnel" className="block">
                <div className="flex items-center gap-2 hover:bg-primary-cream/5 p-2 rounded-md transition-colors">
                  <div onClick={(e) => { e.preventDefault(); toggleCheckbox('evaluation'); }} className="cursor-pointer">
                    {checkedItems.evaluation ? (
                      <CheckSquare className="w-5 h-5 text-primary-coral" />
                    ) : (
                      <Square className="w-5 h-5 text-primary-cream/60" />
                    )}
                  </div>
                  <span className={`${checkedItems.evaluation ? 'text-primary-cream/60 line-through' : 'text-primary-cream'}`}>
                    Évaluation du handicap relationnel
                  </span>
                </div>
              </Link>

              <Link href="/quel-amoureuse-ou-quel-amoureux-es-tu" className="block">
                <div className="flex items-center gap-2 hover:bg-primary-cream/5 p-2 rounded-md transition-colors">
                  <div onClick={(e) => { e.preventDefault(); toggleCheckbox('amoureux'); }} className="cursor-pointer">
                    {checkedItems.amoureux ? (
                      <CheckSquare className="w-5 h-5 text-primary-coral" />
                    ) : (
                      <Square className="w-5 h-5 text-primary-cream/60" />
                    )}
                  </div>
                  <span className={`${checkedItems.amoureux ? 'text-primary-cream/60 line-through' : 'text-primary-cream'}`}>
                    Quel(le) amoureux(se) êtes-vous ?
                  </span>
                </div>
              </Link>

              <Link href="/eros-test" className="block">
                <div className="flex items-center gap-2 hover:bg-primary-cream/5 p-2 rounded-md transition-colors">
                  <div onClick={(e) => { e.preventDefault(); toggleCheckbox('eros'); }} className="cursor-pointer">
                    {checkedItems.eros ? (
                      <CheckSquare className="w-5 h-5 text-primary-coral" />
                    ) : (
                      <Square className="w-5 h-5 text-primary-cream/60" />
                    )}
                  </div>
                  <span className={`${checkedItems.eros ? 'text-primary-cream/60 line-through' : 'text-primary-cream'}`}>
                    Test Eros
                  </span>
                </div>
              </Link>
            </div>

            {/* Right Column - Partner Steps */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-primary-cream mb-3">
                {userProfile?.partnerId ? 'Les étapes de votre partenaire' : (
                  <span className="text-primary-cream/60">En attente de votre partenaire</span>
                )}
              </h3>
              {userProfile?.partnerId ? (
                <>
                  <Link href="/evaluation-handicap-relationnel" className="block">
                    <div className="flex items-center gap-2 hover:bg-primary-cream/5 p-2 rounded-md transition-colors">
                      <div onClick={(e) => { e.preventDefault(); toggleCheckbox('partner_evaluation'); }} className="cursor-pointer">
                        {checkedItems.partner_evaluation ? (
                          <CheckSquare className="w-5 h-5 text-primary-coral" />
                        ) : (
                          <Square className="w-5 h-5 text-primary-cream/60" />
                        )}
                      </div>
                      <span className={`${checkedItems.partner_evaluation ? 'text-primary-cream/60 line-through' : 'text-primary-cream'}`}>
                        Évaluation du handicap relationnel
                      </span>
                    </div>
                  </Link>

                  <Link href="/quel-amoureuse-ou-quel-amoureux-es-tu" className="block">
                    <div className="flex items-center gap-2 hover:bg-primary-cream/5 p-2 rounded-md transition-colors">
                      <div onClick={(e) => { e.preventDefault(); toggleCheckbox('partner_amoureux'); }} className="cursor-pointer">
                        {checkedItems.partner_amoureux ? (
                          <CheckSquare className="w-5 h-5 text-primary-coral" />
                        ) : (
                          <Square className="w-5 h-5 text-primary-cream/60" />
                        )}
                      </div>
                      <span className={`${checkedItems.partner_amoureux ? 'text-primary-cream/60 line-through' : 'text-primary-cream'}`}>
                        Quel(le) amoureux(se) êtes-vous ?
                      </span>
                    </div>
                  </Link>

                  <Link href="/eros-test" className="block">
                    <div className="flex items-center gap-2 hover:bg-primary-cream/5 p-2 rounded-md transition-colors">
                      <div onClick={(e) => { e.preventDefault(); toggleCheckbox('partner_eros'); }} className="cursor-pointer">
                        {checkedItems.partner_eros ? (
                          <CheckSquare className="w-5 h-5 text-primary-coral" />
                        ) : (
                          <Square className="w-5 h-5 text-primary-cream/60" />
                        )}
                      </div>
                      <span className={`${checkedItems.partner_eros ? 'text-primary-cream/60 line-through' : 'text-primary-cream'}`}>
                        Test Eros
                      </span>
                    </div>
                  </Link>
                </>
              ) : (
                <div className="text-center py-8 text-primary-cream/40 italic">
                  Invitez votre partenaire pour commencer votre parcours ensemble
                </div>
              )}
            </div>
          </div>

          {/* Common Steps - Below both columns */}
          <div className="mt-8 pt-6 border-t border-primary-cream/10">
            <h3 className="text-lg font-medium text-primary-cream mb-3">Étapes communes</h3>
            <div className="flex items-center gap-2 hover:bg-primary-cream/5 p-2 rounded-md transition-colors">
              <div onClick={() => toggleCheckbox('appointment')} className="cursor-pointer">
                {checkedItems.appointment ? (
                  <CheckSquare className="w-5 h-5 text-primary-coral" />
                ) : (
                  <Square className="w-5 h-5 text-primary-cream/60" />
                )}
              </div>
              <span className={`${checkedItems.appointment ? 'text-primary-cream/60 line-through' : 'text-primary-cream'}`}>
                Prendre rendez-vous pour votre premier entretien
              </span>
            </div>
          </div>
        </div>

        {/* Offers Panel */}
        {user && (
          <div className="rounded-lg border border-primary-cream/20 bg-primary-cream/10 p-6 mb-6">
            <h2 className="text-xl font-semibold text-primary-coral mb-4 text-center">
              {offersCount === 1 ? 'Votre Offre' : 'Vos Offres'}
            </h2>
            <OffersPanel 
              userId={user.uid} 
              partnerId={userProfile?.partnerId} 
              onOffersLoaded={(offers) => setOffersCount(offers.length)}
            />
          </div>
        )}

        {/* Resources Section */}
        <div className="rounded-lg border border-primary-cream/20 bg-primary-cream/10 p-6">
          <h2 className="text-xl font-semibold text-primary-coral mb-4 text-center">Ressources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/resources/communication" className="block p-4 rounded-md bg-primary-cream/5 hover:bg-primary-cream/10 transition-colors border border-primary-cream/10">
              <h3 className="text-lg font-medium text-primary-coral mb-1">Communication</h3>
              <p className="text-sm text-primary-cream/60">Techniques pour améliorer votre communication de couple</p>
            </Link>
            <Link href="/resources/exercises" className="block p-4 rounded-md bg-primary-cream/5 hover:bg-primary-cream/10 transition-colors border border-primary-cream/10">
              <h3 className="text-lg font-medium text-primary-coral mb-1">Exercices</h3>
              <p className="text-sm text-primary-cream/60">Exercices pratiques à faire ensemble</p>
            </Link>
            <Link href="/resources/articles" className="block p-4 rounded-md bg-primary-cream/5 hover:bg-primary-cream/10 transition-colors border border-primary-cream/10">
              <h3 className="text-lg font-medium text-primary-coral mb-1">Articles</h3>
              <p className="text-sm text-primary-cream/60">Articles sur la thérapie de couple</p>
            </Link>
            <Link href="/resources/faq" className="block p-4 rounded-md bg-primary-cream/5 hover:bg-primary-cream/10 transition-colors border border-primary-cream/10">
              <h3 className="text-lg font-medium text-primary-coral mb-1">FAQ</h3>
              <p className="text-sm text-primary-cream/60">Questions fréquemment posées</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
