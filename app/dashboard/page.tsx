'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User as FirebaseUser, getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CheckSquare, Square, Loader2, PlusCircle, Camera } from 'lucide-react';
import Link from 'next/link';
import { ZenClickButton } from '@/components/ZenClickButton';
import { getUserById, createOrUpdateUser, User as UserProfile } from '@/lib/userService';
import { UserProfileForm } from '@/components/UserProfileForm';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function DashboardPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({
    evaluation: false,
    questionnaire: false,
    appointment: false
  });
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);

    // Check if user is authenticated
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        
        // Fetch user profile data
        async function fetchUserProfile() {
          if (!user) return;
          
          try {
            const profileData = await getUserById(user.uid);
            setUserProfile(profileData);
          } catch (error) {
            console.error('Error fetching user profile:', error);
            toast.error('Failed to load user profile');
          } finally {
            setLoading(false);
          }
        }
        
        fetchUserProfile();
      } else {
        // If not authenticated, redirect to login
        router.push('/login');
      }
    });
    
    return () => unsubscribe();
  }, [router]);

  // Handle profile update
  const handleUpdateProfile = async (formData: Partial<UserProfile>) => {
    if (!user) return;
    
    try {
      setIsUpdatingProfile(true);
      
      // Ensure email is set from the authenticated user
      const userData = {
        ...formData,
        email: user.email || formData.email || ''
      };
      
      const updatedProfile = await createOrUpdateUser(user.uid, userData);
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

  const toggleCheckbox = (id: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Handle photo upload directly from dashboard
  const handlePhotoClick = () => {
    setIsEditingProfile(true);
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
          <h1 className="text-3xl font-bold text-primary-coral">Tableau de bord</h1>
          <div>
            <ZenClickButton />
          </div>
        </div>

        {/* Couple Profile Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Profile Box 1 */}
          <div className="rounded-lg border border-primary-cream/20 bg-primary-cream/10 p-6">
            <div className="flex items-center gap-4">
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
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-cream/60">
                    <PlusCircle className="w-6 h-6 mb-1" />
                    <span className="text-xs">Photo</span>
                  </div>
                )}
                <div className="absolute bottom-0 right-0 bg-primary-coral rounded-full p-1">
                  <Camera className="w-3 h-3 text-primary-cream" />
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
                    ) : 'MODIFIER'}
                  </Button>
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
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-primary-cream/20">
                {/* Placeholder for avatar - replace with actual image if available */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-cream/60">
                  <PlusCircle className="w-6 h-6 mb-1" />
                  <span className="text-xs">Photo</span>
                </div>
                <div className="absolute bottom-0 right-0 bg-primary-coral rounded-full p-1">
                  <Camera className="w-3 h-3 text-primary-cream" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-primary-cream">Partenaire 2</h3>
                <p className="text-sm text-primary-cream/60">partenaire@exemple.com</p>
              </div>
              <Button 
                variant="outline" 
                className="border-primary-cream/20 text-primary-cream hover:bg-primary-cream/10 hover:text-primary-coral"
              >
                MODIFIER
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg border border-primary-cream/20 bg-primary-cream/10 p-6">
            {/* TODO Section */}
            <div className="mb-8">
              <h2 className="text-4xl font-black tracking-tight mb-4" style={{ color: '#D9B70D' }}>À faire</h2>
              <div className="space-y-4">
                {/* Evaluation Item */}
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleCheckbox('evaluation')}
                    className="mt-1 text-primary-cream hover:text-primary-coral transition-colors"
                  >
                    {checkedItems.evaluation ? (
                      <CheckSquare className="w-5 h-5" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                  <div className="grid gap-1.5 leading-none">
                    <Link
                      href="/evaluation-handicap-relationnel"
                      className="text-sm font-medium leading-none text-primary-cream hover:text-primary-coral transition-colors"
                    >
                      Formulaire d'Évaluation du Handicap Relationnel
                    </Link>
                    <p className="text-sm text-primary-cream/60">
                      Évaluez votre niveau d'autonomie dans vos relations sociales et intimes
                    </p>
                  </div>
                </div>

                {/* Questionnaire Item */}
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleCheckbox('questionnaire')}
                    className="mt-1 text-primary-cream hover:text-primary-coral transition-colors"
                  >
                    {checkedItems.questionnaire ? (
                      <CheckSquare className="w-5 h-5" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                  <div className="grid gap-1.5 leading-none">
                    <Link
                      href="/questionnaire"
                      className="text-sm font-medium leading-none text-primary-cream hover:text-primary-coral transition-colors"
                    >
                      Remplir le questionnaire d'estime de soi
                    </Link>
                    <p className="text-sm text-primary-cream/60">
                      Un questionnaire pour mieux comprendre votre relation avec vous-même
                    </p>
                  </div>
                </div>

                {/* Appointment Item */}
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleCheckbox('appointment')}
                    className="mt-1 text-primary-cream hover:text-primary-coral transition-colors"
                  >
                    {checkedItems.appointment ? (
                      <CheckSquare className="w-5 h-5" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                  <div className="grid gap-1.5 leading-none">
                    <Link
                      href="/appointment"
                      className="text-sm font-medium leading-none text-primary-cream hover:text-primary-coral transition-colors"
                    >
                      Prendre rendez-vous avec votre coach
                    </Link>
                    <p className="text-sm text-primary-cream/60">
                      Planifiez votre prochaine séance de coaching
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Capsules Section */}
          <div className="rounded-lg border border-primary-cream/20 bg-primary-cream/10 p-6 flex flex-col">
            <div>
              <h2 className="text-4xl font-black text-primary-coral tracking-tight mb-4">Capsules</h2>
              <p className="text-sm text-primary-cream/80 mb-4">
                Accédez à nos capsules vidéo pour votre développement personnel
              </p>
            </div>
            <div className="mt-auto flex justify-end">
              <Link
                href="/capsules"
                className="inline-flex items-center px-4 py-2 rounded-full border-2 border-primary-cream text-primary-cream hover:bg-primary-cream/10 transition-all duration-200"
              >
                Voir mes capsules
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-primary-cream/20 bg-primary-cream/10 p-6 flex flex-col">
            <div>
              <h2 className="text-4xl font-black text-primary-coral tracking-tight mb-4">Votre prochain rendez-vous</h2>
              <p className="text-sm text-primary-cream/80 mb-4">
                Planifiez votre prochaine séance de coaching
              </p>
            </div>
            <div className="mt-auto flex justify-end">
              <Link
                href="/appointment"
                className="inline-flex items-center px-4 py-2 rounded-full border-2 border-primary-cream text-primary-cream hover:bg-primary-cream/10 transition-all duration-200"
              >
                Prendre rendez-vous
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
