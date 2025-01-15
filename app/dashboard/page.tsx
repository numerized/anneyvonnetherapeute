'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);
    
    // Check if we're already authenticated
    if (auth.currentUser) {
      setUser(auth.currentUser);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
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
    const auth = getAuth(app);
    try {
      await auth.signOut();
      router.push('/login');
      toast.success('Successfully signed out');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[hsl(var(--background))]">
        <div className="text-center">
          <p className="text-[hsl(var(--muted-foreground))]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Router will redirect
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="mt-2 text-[hsl(var(--muted-foreground))]">
              Welcome back, {user.email}!
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>

        {/* Add your dashboard content here */}
        <div className="grid gap-6">
          <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
            <h2 className="text-xl font-semibold">Getting Started</h2>
            <p className="mt-2 text-[hsl(var(--muted-foreground))]">
              This is your dashboard. You can start customizing it based on your needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
