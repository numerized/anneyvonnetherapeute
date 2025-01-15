'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, signOut, User } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ClipboardList, CheckSquare, Square } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({
    questionnaire: false,
    appointment: false,
  });
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);
    
    // Check if we're already authenticated
    if (auth.currentUser) {
      setUser(auth.currentUser);
      setLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        // If not authenticated, redirect to login
        router.push('/login');
        toast.error('Please sign in to access the dashboard');
      }
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      const auth = getAuth(app);
      await signOut(auth);
      router.push('/login');
      toast.success('Successfully signed out');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const toggleCheckbox = (id: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (loading) {
    return (
      <div className="relative min-h-screen grid place-items-center bg-primary-forest">
        <div className="text-center">
          <p className="text-primary-cream/80">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Router will redirect
  }

  return (
    <div className="min-h-screen bg-primary-forest p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-primary-cream tracking-tight">Dashboard</h1>
            <p className="mt-2 text-primary-cream/80">
              Welcome back, {user.email}!
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="border-primary-cream/20 text-primary-cream hover:bg-primary-cream/10 hover:text-primary-coral"
          >
            Sign Out
          </Button>
        </div>

        {/* TODO Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="w-6 h-6 text-primary-cream" />
            <h2 className="text-2xl font-bold text-primary-cream">À faire</h2>
          </div>
          <div className="rounded-lg border border-primary-cream/20 bg-primary-cream/10 p-6">
            <div className="space-y-4">
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

        {/* Dashboard Cards */}
        <div className="grid gap-6">
          <div className="rounded-lg border border-primary-cream/20 bg-primary-cream/10 p-6">
            <h2 className="text-2xl font-bold text-primary-cream">Getting Started</h2>
            <p className="mt-2 text-primary-cream/80">
              This is your dashboard. You can start customizing it based on your needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-lg border border-primary-cream/20 bg-primary-cream/10 p-6">
              <h3 className="text-xl font-bold text-primary-cream">Statistics</h3>
              <p className="mt-2 text-primary-cream/80">
                View your analytics and performance metrics here.
              </p>
            </div>
            
            <div className="rounded-lg border border-primary-cream/20 bg-primary-cream/10 p-6">
              <h3 className="text-xl font-bold text-primary-cream">Recent Activity</h3>
              <p className="mt-2 text-primary-cream/80">
                Track your latest actions and updates here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
