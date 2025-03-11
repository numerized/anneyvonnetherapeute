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
  const [manualEmail, setManualEmail] = useState('');
  const [debugInfo, setDebugInfo] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    async function verifyEmail() {
      const auth = getAuth(app);
      
      try {
        // Collect debug info
        const debug = {
          url: window.location.href,
          storedEmail: window.localStorage.getItem('emailForSignIn'),
          isEmailLink: isSignInWithEmailLink(auth, window.location.href),
          timestamp: new Date().toISOString()
        };
        setDebugInfo(debug);
        console.log('Debug info:', debug);

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
        console.log('Sign in successful:', result);
        
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

  const handleManualSignIn = async () => {
    if (!manualEmail) {
      toast.error('Veuillez entrer votre email');
      return;
    }

    const auth = getAuth(app);
    try {
      const result = await signInWithEmailLink(auth, manualEmail, window.location.href);
      console.log('Manual sign in successful:', result);
      router.push('/auth/complete-profile');
    } catch (error: any) {
      console.error('Manual sign in error:', error);
      toast.error(error.message || "Une erreur s'est produite");
    }
  };

  const getErrorMessage = () => {
    switch (error) {
      case 'invalid-link':
        return "Ce lien n'est plus valide. Veuillez demander un nouveau lien de connexion.";
      case 'no-email':
        return "Nous n'avons pas pu retrouver votre email. Veuillez l'entrer ci-dessous :";
      default:
        return "Une erreur s'est produite lors de la vérification. Veuillez réessayer.";
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-4 text-center">
          <h1 className="text-2xl font-semibold">Vérification en cours...</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-red-600 mb-4">
            {error === 'no-email' ? 'Email requis' : 'Erreur de vérification'}
          </h1>
          <p className="mb-4">{getErrorMessage()}</p>
        </div>

        {error === 'no-email' && (
          <div className="space-y-4">
            <input
              type="email"
              value={manualEmail}
              onChange={(e) => setManualEmail(e.target.value)}
              placeholder="Entrez votre email"
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-primary"
            />
            <Button
              onClick={handleManualSignIn}
              className="w-full"
            >
              Continuer
            </Button>
          </div>
        )}

        <div className="space-y-4">
          <Link href="/auth" passHref>
            <Button variant="outline" className="w-full">
              Retour à la connexion
            </Button>
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm">
            <h3 className="font-semibold mb-2">Debug Info:</h3>
            <pre className="whitespace-pre-wrap overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
