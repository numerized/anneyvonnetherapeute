'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Save email for later verification
      window.localStorage.setItem('emailForSignIn', email);

      // Show success message
      toast.success('Lien magique envoyé ! Vérifiez votre email.');
      
      // Optional: Redirect to a confirmation page
      router.push('/login/check-email');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Échec de l\'envoi du lien magique. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen grid place-items-center bg-primary-forest">
      <div className="w-full max-w-md px-4 space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-4xl font-black text-primary-cream tracking-tight">
            Connexion
          </h2>
          <p className="mt-2 text-primary-cream/80">
            Pour accéder à votre espace personnel, entrez votre adresse email ci-dessous.
            <br />
            Nous vous enverrons un lien sécurisé par email pour vous connecter sans mot de passe.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="sr-only">
              Adresse email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="block w-full bg-primary-cream/10 border-primary-cream/20 text-primary-cream placeholder:text-primary-cream/50 focus:border-primary-coral focus:ring-primary-coral"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-coral hover:bg-primary-rust transition-colors text-primary-cream font-bold rounded-[24px]"
          >
            {isLoading ? 'Envoi en cours...' : 'Envoyer le lien magique'}
          </Button>
        </form>
      </div>
    </div>
  );
}
