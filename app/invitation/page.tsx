'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function InvitationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') ?? '';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const validateInvitation = async () => {
      if (!token) {
        setError('Token d\'invitation manquant');
        setLoading(false);
        return;
      }

      try {
        const db = getFirestore(app);
        const invitationsRef = collection(db, 'invitations');
        const q = query(invitationsRef, where('token', '==', token));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError('Token d\'invitation invalide');
          setLoading(false);
          return;
        }

        const invitationDoc = querySnapshot.docs[0];
        const invitationData = invitationDoc.data();

        // Check if invitation is expired
        if (invitationData.expiresAt.toDate() < new Date()) {
          setError('Cette invitation a expiré');
          setLoading(false);
          return;
        }

        // Check if invitation is already used
        if (invitationData.status === 'completed') {
          setError('Cette invitation a déjà été utilisée');
          setLoading(false);
          return;
        }

        setInvitation({ id: invitationDoc.id, ...invitationData });
        setEmail(invitationData.partnerEmail);
        setLoading(false);
      } catch (error) {
        console.error('Error validating invitation:', error);
        setError('Erreur lors de la validation de l\'invitation');
        setLoading(false);
      }
    };

    validateInvitation();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          invitationToken: token,
          invitationId: invitation.id,
          inviterId: invitation.inviterId
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Save email for later verification
      window.localStorage.setItem('emailForSignIn', email);
      window.localStorage.setItem('invitationToken', token);
      window.localStorage.setItem('invitationId', invitation.id);
      window.localStorage.setItem('inviterId', invitation.inviterId);

      // Show success message
      toast.success('Lien magique envoyé ! Vérifiez votre email.');
      
      // Redirect to check email page
      router.push('/login/check-email');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Échec de l\'envoi du lien magique. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-forest flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary-cream/80" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary-forest flex items-center justify-center">
        <div className="max-w-md w-full mx-4 p-6 rounded-lg border border-primary-cream/20 bg-primary-cream/10">
          <h2 className="text-2xl font-bold text-primary-coral mb-4">Erreur</h2>
          <p className="text-primary-cream mb-6">{error}</p>
          <Button
            onClick={() => router.push('/')}
            className="w-full bg-primary-coral hover:bg-primary-coral/90 text-white"
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen grid place-items-center bg-primary-forest">
      <div className="w-full max-w-md px-4 space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-4xl font-black text-primary-cream tracking-tight">
            Rejoignez votre partenaire
          </h2>
          <p className="mt-2 text-primary-cream/80">
            Pour accéder à votre espace personnel, confirmez votre email ci-dessous.
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
              disabled={true}
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
