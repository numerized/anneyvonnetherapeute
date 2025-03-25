'use client';

import { Button } from '@/components/ui/button';
import { TeamProfileSection } from '@/components/dashboard/TeamProfileSection';
import { UsersList } from '@/components/dashboard/UsersList';
import { ZenClickButton } from '@/components/ZenClickButton';
import { app } from '@/lib/firebase';
import { getAllUsers } from '@/lib/adminService';
import { createOrUpdateUser, getUserById, UserProfile } from '@/lib/userService';
import { format, parseISO, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getAuth, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { LogOut, Clock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function TeamDashboardPage() {
  const router = useRouter();

  // Authentication state
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // UI refresh counter
  const [uiRefreshKey, setUiRefreshKey] = useState(0);

  // Function to handle sign out
  const handleSignOut = async () => {
    try {
      const auth = getAuth(app);
      await signOut(auth);
      router.push('/'); // Redirect to home page after sign out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Get user profile
  const getUserProfile = async (userId: string) => {
    try {
      const userProfile = await getUserById(userId);
      if (!userProfile) {
        return { userProfile: null };
      }

      return { userProfile };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return { userProfile: null };
    }
  };

  // Handle profile update
  const handleProfileUpdate = async () => {
    if (!user?.uid) return;
    const { userProfile } = await getUserProfile(user.uid);
    setUserProfile(userProfile);
  };

  useEffect(() => {
    const auth = getAuth(app);

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);

        // Check if user is a therapist
        const db = getFirestore(app);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        
        if (!userData?.isTherapist) {
          // If not a therapist, redirect to regular dashboard
          router.push('/dashboard');
          return;
        }

        try {
          const { userProfile } = await getUserProfile(user.uid);
          setUserProfile(userProfile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        } finally {
          setLoading(false);
        }
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Effect to load user profile and all users
  useEffect(() => {
    if (user?.uid) {
      Promise.all([
        getUserProfile(user.uid),
        getAllUsers()
      ]).then(([{ userProfile }, allUsers]) => {
        setUserProfile(userProfile);
        setUsers(allUsers);
      }).catch(error => {
        console.error('Error fetching data:', error);
      });
    }
  }, [user?.uid]);

  // Render user profile section
  const renderUserProfileSection = () => (
    <TeamProfileSection
      user={user}
      userProfile={userProfile}
      onProfileUpdate={handleProfileUpdate}
    />
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-forest flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-6 h-6 animate-spin text-primary-cream/80" />
        </div>
      </div>
    );
  }

  return (
    <div key={uiRefreshKey} className="min-h-screen bg-primary-forest text-primary-cream">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary-coral text-center">Tableau de bord Thérapeute</h1>
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

        <div className="mb-12">
          {renderUserProfileSection()}
        </div>

        {/* Users List Section */}
        <UsersList users={users} />

        {/* Add any team-specific features here */}
      </div>
    </div>
  );
}
