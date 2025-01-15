'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { toast } from "sonner";

export default function VerifyPage() {
  const [isVerifying, setIsVerifying] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function verifyEmail() {
      const auth = getAuth(app);
      
      // Get the email from localStorage
      const email = window.localStorage.getItem('emailForSignIn');
      const currentUrl = window.location.href;

      if (!email) {
        toast.error('No email found. Please try logging in again.');
        router.push('/login');
        return;
      }

      try {
        // First, verify with Firebase directly
        if (isSignInWithEmailLink(auth, currentUrl)) {
          // Sign in with Firebase
          await signInWithEmailLink(auth, email, currentUrl);

          // Then call our API to handle any server-side auth
          const response = await fetch('/api/auth/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              link: currentUrl,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Verification failed');
          }

          // Clear the email from localStorage
          window.localStorage.removeItem('emailForSignIn');

          // Show success message
          toast.success('Successfully signed in!');

          // Redirect to dashboard
          router.push('/dashboard');
        } else {
          throw new Error('Invalid verification link');
        }
      } catch (error) {
        console.error('Verification error:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to verify email link');
        router.push('/login');
      } finally {
        setIsVerifying(false);
      }
    }

    verifyEmail();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[hsl(var(--background))]">
      <div className="text-center">
        {isVerifying ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[hsl(var(--foreground))]">Verifying your email...</h2>
            <p className="text-[hsl(var(--muted-foreground))]">Please wait while we complete the sign-in process.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
