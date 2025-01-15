'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function CheckEmailPage() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    setEmail(window.localStorage.getItem('emailForSignIn'));
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[hsl(var(--background))] px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Check your email</h2>
        
        <div className="space-y-4">
          {email && (
            <p className="text-[hsl(var(--muted-foreground))]">
              We've sent a magic link to <span className="font-medium text-[hsl(var(--foreground))]">{email}</span>
            </p>
          )}
          
          <p className="text-[hsl(var(--muted-foreground))]">
            Click the link in the email to sign in to your account.
          </p>

          <div className="pt-4">
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              Didn't receive the email?
            </p>
            <Link href="/login">
              <Button variant="ghost" className="mt-2">
                Try again
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
