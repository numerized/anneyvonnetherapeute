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
      
      try {
        // Get the email from localStorage
        const email = window.localStorage.getItem('emailForSignIn');
        console.log('Retrieved email from localStorage:', email);

        if (!email) {
          console.error('No email found in localStorage');
          toast.error('No email found. Please try logging in again.');
          router.push('/login');
          return;
        }

        // Get the current URL
        const currentUrl = window.location.href;
        console.log('Current URL:', currentUrl);

        // Check if this is a valid sign-in link
        const isValid = isSignInWithEmailLink(auth, currentUrl);
        console.log('Is sign-in link valid?', isValid);

        if (!isValid) {
          console.error('Invalid sign-in link');
          toast.error('Invalid verification link. Please request a new one.');
          router.push('/login');
          return;
        }

        // Attempt to sign in
        console.log('Attempting to sign in...');
        await signInWithEmailLink(auth, email, currentUrl);
        console.log('Successfully signed in with Firebase');

        // Clear the email from localStorage
        window.localStorage.removeItem('emailForSignIn');
        console.log('Cleared email from localStorage');

        // Show success message
        toast.success('Successfully signed in!');

        // Redirect to dashboard
        router.push('/dashboard');
      } catch (error: any) {
        console.error('Verification error:', {
          code: error.code,
          message: error.message,
          stack: error.stack
        });

        let errorMessage = 'Failed to verify email link';

        if (error.code === 'auth/invalid-action-code') {
          errorMessage = 'This link has expired or already been used. Please request a new one.';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'Invalid email address. Please try again.';
        }

        toast.error(errorMessage);
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
