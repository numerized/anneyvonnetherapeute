'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User as FirebaseUser, getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CheckSquare, Square, Loader2, PlusCircle, X } from 'lucide-react';
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

  // Handle photo deletion directly from dashboard
  const handleDeletePhoto = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent click handler
    
    if (!user) return;
    
    try {
      setIsUpdatingProfile(true);
      
      // Update user profile with null photo
      const userData = {
        ...userProfile,
        photo: null
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
                      <PlusCircle className="w-6 h-6 mb-1" />
                      <span className="text-xs">
                        Ajouter<br/>une photo
                      </span>
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
                <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-cream/60 text-center">
                  <PlusCircle className="w-6 h-6 mb-1" />
                  <span className="text-xs">
                    Ajouter<br/>une photo
                  </span>
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
                INVITER
              </Button>
            </div>
          </div>
        </div>

        {/* Checklist Section */}
        <div className="rounded-lg border border-primary-cream/20 bg-primary-cream/10 p-6 mb-6">
          <h2 className="text-xl font-semibold text-primary-coral mb-4 text-center">Votre parcours</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div onClick={() => toggleCheckbox('evaluation')} className="cursor-pointer">
                {checkedItems.evaluation ? (
                  <CheckSquare className="w-5 h-5 text-primary-coral" />
                ) : (
                  <Square className="w-5 h-5 text-primary-cream/60" />
                )}
              </div>
              <span className={`${checkedItems.evaluation ? 'text-primary-cream/60 line-through' : 'text-primary-cream'}`}>
                Compléter l'évaluation initiale
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div onClick={() => toggleCheckbox('questionnaire')} className="cursor-pointer">
                {checkedItems.questionnaire ? (
                  <CheckSquare className="w-5 h-5 text-primary-coral" />
                ) : (
                  <Square className="w-5 h-5 text-primary-cream/60" />
                )}
              </div>
              <span className={`${checkedItems.questionnaire ? 'text-primary-cream/60 line-through' : 'text-primary-cream'}`}>
                Remplir le questionnaire de couple
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div onClick={() => toggleCheckbox('appointment')} className="cursor-pointer">
                {checkedItems.appointment ? (
                  <CheckSquare className="w-5 h-5 text-primary-coral" />
                ) : (
                  <Square className="w-5 h-5 text-primary-cream/60" />
                )}
              </div>
              <span className={`${checkedItems.appointment ? 'text-primary-cream/60 line-through' : 'text-primary-cream'}`}>
                Prendre rendez-vous pour la première session
              </span>
            </div>
          </div>
        </div>

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
