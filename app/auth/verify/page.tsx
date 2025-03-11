'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { toast } from 'sonner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getFunctions, httpsCallable } from 'firebase/functions';

export default function VerifyPage() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [manualEmail, setManualEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function verifyEmail() {
      const auth = getAuth(app);
      
      try {
        if (!isSignInWithEmailLink(auth, window.location.href)) {
          setError('invalid-link');
          return;
        }

        const email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
          setError('no-email');
          return;
        }

        const result = await signInWithEmailLink(auth, email, window.location.href);
        window.localStorage.removeItem('emailForSignIn');

        const invitationToken = window.localStorage.getItem('invitationToken');
        const invitationId = window.localStorage.getItem('invitationId');
        const inviterId = window.localStorage.getItem('inviterId');

        if (invitationToken && invitationId && inviterId) {
          window.localStorage.removeItem('invitationToken');
          window.localStorage.removeItem('invitationId');
          window.localStorage.removeItem('inviterId');

          try {
            const functions = getFunctions(app, 'us-central1');
            const connectPartnersFunction = httpsCallable(functions, 'connectPartners');
            await connectPartnersFunction({ invitationId, inviterId });

            toast.success('Connexion partenaire réussie !');
            router.push('/dashboard');
            return;
          } catch (error: any) {
            console.error('Error connecting partner accounts:', error);
            toast.error(error.message || 'Erreur lors de la connexion des comptes partenaires');
          }
        }
        
        router.push('/auth/complete-profile');
      } catch (error: any) {
        console.error('Verification error:', error);
        
        if (error.code === 'auth/invalid-action-code') {
          setError('invalid-link');
        } else {
          setError('unknown');
        }
        
        toast.error(
          error.code === 'auth/invalid-action-code'
            ? "Le lien n'est plus valide. Veuillez demander un nouveau lien."
            : "Une erreur s'est produite. Veuillez réessayer."
        );
      } finally {
        setIsVerifying(false);
      }
    }

    verifyEmail();
  }, [router]);

  const handleManualVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    try {
      const auth = getAuth(app);
      await signInWithEmailLink(auth, manualEmail, window.location.href);
      window.localStorage.removeItem('emailForSignIn');
      router.push('/auth/complete-profile');
    } catch (error: any) {
      console.error('Manual verification error:', error);
      toast.error("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="relative min-h-screen grid place-items-center bg-primary-forest">
      <div className="w-full max-w-md px-4 space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-4xl font-black text-primary-cream tracking-tight">
            Vérification
          </h2>
          {isVerifying ? (
            <p className="mt-2 text-primary-cream/80">
              Vérification de votre email en cours...
            </p>
          ) : error === 'no-email' ? (
            <>
              <p className="mt-2 text-primary-cream/80">
                Nous n'avons pas trouvé votre email. Veuillez le saisir à nouveau ci-dessous.
              </p>
              <form onSubmit={handleManualVerification} className="mt-8 space-y-6">
                <Input
                  type="email"
                  required
                  placeholder="Entrez votre email"
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                  className="block w-full bg-primary-cream/10 border-primary-cream/20 text-primary-cream placeholder:text-primary-cream/50 focus:border-primary-coral focus:ring-primary-coral"
                />
                <Button
                  type="submit"
                  className="w-full bg-primary-coral hover:bg-primary-rust transition-colors text-primary-cream font-bold rounded-[24px]"
                >
                  Vérifier
                </Button>
              </form>
            </>
          ) : error === 'invalid-link' ? (
            <div className="space-y-6">
              <p className="mt-2 text-primary-cream/80">
                Ce lien n'est plus valide. Veuillez demander un nouveau lien de connexion.
              </p>
              <Button
                onClick={() => router.push('/login')}
                className="w-full bg-primary-coral hover:bg-primary-rust transition-colors text-primary-cream font-bold rounded-[24px]"
              >
                Retour à la connexion
              </Button>
            </div>
          ) : error === 'unknown' ? (
            <div className="space-y-6">
              <p className="mt-2 text-primary-cream/80">
                Une erreur s'est produite. Veuillez réessayer.
              </p>
              <Button
                onClick={() => router.push('/login')}
                className="w-full bg-primary-coral hover:bg-primary-rust transition-colors text-primary-cream font-bold rounded-[24px]"
              >
                Retour à la connexion
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
