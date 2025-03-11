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
  const [shouldShowForm, setShouldShowForm] = useState(false);
  const router = useRouter();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.push('/auth/login');
        return;
      }

      try {
        const userProfile = await getUserById(firebaseUser.uid);
        
        // If profile exists, redirect to dashboard
        if (userProfile) {
          router.push('/dashboard');
          return;
        }

        // Only show form if profile doesn't exist
        setUser(firebaseUser);
        setUserData({
          email: firebaseUser.email || '',
          prenom: '',
          nom: '',
          telephone: '',
          photo: undefined,
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date()
        });
        setShouldShowForm(true);
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
      await createOrUpdateUser(user.uid, formData);
      toast.success('Profil mis à jour avec succès !');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    }
  };

  if (!shouldShowForm) {
    return (
      <div className="min-h-screen bg-primary-forest flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-coral"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-forest p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-coral mb-8">Compléter votre profil</h1>
        {userData && <UserProfileForm initialData={userData} onSubmit={handleSubmit} />}
      </div>
    </div>
  );
}
