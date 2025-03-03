'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { createOrUpdateUser, getUserById, User } from '@/lib/userService';
import { UserProfileForm } from '@/components/UserProfileForm';
import { toast } from 'sonner';

export default function CompleteProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        try {
          // Check if user profile exists
          const userProfile = await getUserById(firebaseUser.uid);
          
          // If no profile exists yet, create initial data with email
          if (!userProfile) {
            setUserData({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              prenom: '',
              nom: '',
              telephone: '',
              dateNaissance: null,
              createdAt: new Date(),
              updatedAt: new Date()
            });
          } else {
            setUserData(userProfile);
            
            // If user profile already exists and is complete, redirect to dashboard
            if (userProfile.prenom && userProfile.nom) {
              router.push('/dashboard');
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        // Not authenticated, redirect to login
        router.push('/auth/login');
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  const handleSubmitProfile = async (formData: Partial<User>) => {
    if (!user) return;
    
    try {
      // Ensure email is set from the authenticated user
      const userData = {
        ...formData,
        email: user.email || formData.email || ''
      };
      
      await createOrUpdateUser(user.uid, userData);
      toast.success('Profil créé avec succès');
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating user profile:', error);
      toast.error('Erreur lors de la création du profil');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-forest flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md p-6 rounded-lg bg-primary-forest border border-primary-cream/20">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-primary-coral">Chargement...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-forest flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-6 rounded-lg bg-primary-forest border border-primary-cream/20">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-primary-coral">Complétez votre profil</h1>
          <p className="text-primary-cream/60 mt-2">
            Veuillez fournir quelques informations pour compléter votre profil
          </p>
        </div>
        
        <UserProfileForm 
          user={userData} 
          onSubmit={handleSubmitProfile} 
          isFirstTime={!userData?.prenom || !userData?.nom}
        />
      </div>
    </div>
  );
}
