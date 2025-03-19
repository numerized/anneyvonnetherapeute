'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { User, createOrUpdateUser, getUserById } from '@/lib/userService';
import { UserProfileForm } from '@/components/UserProfileForm';
import { toast } from 'sonner';

export default function CompleteProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const router = useRouter();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.push('/auth/login');
        return;
      }

      try {
        const existingUser = await getUserById(firebaseUser.uid);
        if (existingUser) {
          router.push('/dashboard');
          return;
        }

        setUser(firebaseUser);
        setUserData({
          id: firebaseUser.uid,
          prenom: '',
          nom: '',
          telephone: '',
          dateNaissance: undefined,
          email: firebaseUser.email || '',
          photo: undefined
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  const handleSubmit = async (formData: Partial<User>) => {
    if (!user) return;

    try {
      if (userData?.id) {
        await createOrUpdateUser({
          ...userData,
          ...formData
        });
        toast.success('Profil mis à jour avec succès !');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-primary-forest flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-coral"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-dark text-primary-cream p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-coral mb-8">Compléter votre profil</h1>
        {userData && <UserProfileForm user={userData} onSubmit={handleSubmit} isFirstTime={true} />}
      </div>
    </div>
  );
}
