'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, signOut, User } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CheckSquare, Square, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ZenClickButton } from '@/components/ZenClickButton';
import { CalendlyModal } from '@/components/dashboard/CalendlyModal';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({
    evaluation: false,
    questionnaire: false,
    appointment: false,
  });
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);

    // Set initial state
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

    return () => unsubscribe();
  }, [router]);

  // Don't render anything while loading
  if (loading) {
    return (
      <div className="relative min-h-screen grid place-items-center bg-primary-forest">
        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary-cream/80" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

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

  return (
    <div className="min-h-screen bg-primary-forest p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-primary-cream tracking-tight">Conversion 180° d'Amour</h1>
            <p className="mt-2 text-primary-cream/80">
              Bienvenue, {user.email} dans votre espace personnel.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ZenClickButton />
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="border-primary-cream/20 text-primary-cream hover:bg-primary-cream/10 hover:text-primary-coral"
            >
              Se déconnecter
            </Button>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid gap-6">
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
                      <button
                        onClick={() => setIsCalendlyOpen(true)}
                        className="text-sm font-medium leading-none text-primary-cream hover:text-primary-coral transition-colors"
                      >
                        Prendre rendez-vous avec votre coach
                      </button>
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
                <button
                  onClick={() => setIsCalendlyOpen(true)}
                  className="inline-flex items-center px-4 py-2 rounded-full border-2 border-primary-cream text-primary-cream hover:bg-primary-cream/10 transition-all duration-200"
                >
                  Prendre rendez-vous
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Calendly Modal */}
        <CalendlyModal 
          isOpen={isCalendlyOpen}
          onClose={() => setIsCalendlyOpen(false)}
        />
      </div>
    </div>
  );
}
