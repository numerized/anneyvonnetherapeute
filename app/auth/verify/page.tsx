'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { toast } from 'sonner';

export default function VerifyPage() {
  const [isVerifying, setIsVerifying] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const auth = getAuth(app);
    
    const verifyEmail = async () => {
      try {
        // Get the email from localStorage
        const email = window.localStorage.getItem('emailForSignIn');
        console.log('Retrieved email from localStorage:', email);

        if (!email) {
          toast.error('No email found. Please try signing in again.');
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
          toast.error('Invalid sign-in link. Please try signing in again.');
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
          email: window.localStorage.getItem('emailForSignIn'),
          url: window.location.href,
        });

        toast.error(
          error.code === 'auth/invalid-action-code'
            ? 'Invalid or expired sign-in link. Please try signing in again.'
            : 'Failed to verify email. Please try signing in again.'
        );

        router.push('/login');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [router, searchParams]);

  return (
    <div className="relative min-h-screen grid place-items-center bg-primary-forest">
      <div className="text-center">
        {isVerifying && (
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-primary-cream tracking-tight">
              Verifying your email...
            </h2>
            <p className="text-primary-cream/80">
              Please wait while we complete the sign-in process.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
