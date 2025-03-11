'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { toast } from 'sonner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getFunctions, httpsCallable } from 'firebase/functions';

export default function VerifyPage() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function verifyEmail() {
      const auth = getAuth(app);
      
      try {
        // Check if this is a sign-in link
        if (!isSignInWithEmailLink(auth, window.location.href)) {
          setError('invalid-link');
          return;
        }

        // Get the email from localStorage
        const email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
          setError('no-email');
          return;
        }

        // Sign in with email link
        const result = await signInWithEmailLink(auth, email, window.location.href);
        
        // Clear email from storage
        window.localStorage.removeItem('emailForSignIn');

        // Check if this is an invitation verification
        const invitationToken = window.localStorage.getItem('invitationToken');
        const invitationId = window.localStorage.getItem('invitationId');
        const inviterId = window.localStorage.getItem('inviterId');

        if (invitationToken && invitationId && inviterId) {
          // Clear invitation data from storage
          window.localStorage.removeItem('invitationToken');
          window.localStorage.removeItem('invitationId');
          window.localStorage.removeItem('inviterId');

          try {
            // Call the Cloud Function to connect partners
            const functions = getFunctions(app, 'us-central1');
            const connectPartnersFunction = httpsCallable(functions, 'connectPartners');
            await connectPartnersFunction({ invitationId, inviterId });

            toast.success('Connexion partenaire réussie !');
            router.push('/dashboard');
            return;
          } catch (error: any) {
            console.error('Error connecting partner accounts:', error);
            toast.error(error.message || 'Erreur lors de la connexion des comptes partenaires');
            // If partner connection fails, continue to complete profile
          }
        }
        
        // If not an invitation or if partner connection failed, redirect to complete profile
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

  const getErrorMessage = () => {
    switch (error) {
      case 'invalid-link':
        return "Ce lien n'est plus valide. Veuillez demander un nouveau lien de connexion.";
      case 'no-email':
        return "Nous n'avons pas pu retrouver votre email. Veuillez réessayer de vous connecter.";
      default:
        return "Une erreur s'est produite lors de la vérification. Veuillez réessayer.";
    }
  };

  return (
    <div className="relative min-h-screen grid place-items-center bg-primary-forest">
      <div className="w-full max-w-md px-4 space-y-8">
        <div className="text-center">
          {isVerifying ? (
            <>
              <h2 className="mt-6 text-4xl font-black text-primary-cream tracking-tight">
                Vérification en cours...
              </h2>
              <p className="mt-2 text-primary-cream/80">
                Veuillez patienter pendant que nous vérifions votre email.
              </p>
            </>
          ) : error ? (
            <>
              <h2 className="mt-6 text-4xl font-black text-primary-cream tracking-tight">
                Erreur de vérification
              </h2>
              <p className="mt-2 text-primary-cream/80">
                {getErrorMessage()}
              </p>
              <div className="mt-6">
                <Link href="/login">
                  <Button className="w-full bg-primary-coral hover:bg-primary-rust transition-colors text-primary-cream font-bold rounded-[24px]">
                    Retour à la connexion
                  </Button>
                </Link>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
