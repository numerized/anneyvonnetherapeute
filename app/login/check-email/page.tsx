'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function CheckEmailPage() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // Get email from localStorage
    const storedEmail = window.localStorage.getItem('emailForSignIn');
    setEmail(storedEmail);
  }, []);

  return (
    <div className="relative min-h-screen grid place-items-center bg-primary-forest">
      <div className="w-full max-w-md px-4 space-y-8 text-center">
        <h2 className="text-4xl font-black text-primary-cream tracking-tight">Check your email</h2>
        
        <div className="space-y-4">
          {email && (
            <p className="text-primary-cream/80">
              We've sent a magic link to <span className="font-medium text-primary-cream">{email}</span>
            </p>
          )}
          
          <p className="text-primary-cream/80">
            Click the link in the email to sign in to your account.
          </p>

          <div className="mt-8">
            <p className="text-sm text-primary-cream/80">
              Didn't receive the email?
            </p>
            <Link href="/login">
              <Button 
                variant="ghost" 
                className="mt-2 text-primary-cream hover:text-primary-coral hover:bg-primary-cream/10"
              >
                Try again
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
