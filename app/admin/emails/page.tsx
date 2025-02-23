'use client';

import { useState } from 'react';
import { TherapyEmailType } from '@/functions/src/types/emails';
import TherapyTimeline from '@/components/shared/TherapyTimeline';
import { therapyJourneyEvents } from '@/lib/therapyJourney';

const TEST_PASSWORD = 'TEST180YYY';

export default function AdminEmailsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('numerized@gmail.com');
  const [status, setStatus] = useState<string>('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === TEST_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      setStatus('Mot de passe invalide');
    }
  };

  const handleSendEmail = async (emailType: TherapyEmailType) => {
    try {
      setStatus(`Envoi de ${emailType}...`);
      const response = await fetch('/api/admin/send-test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailType,
          recipientEmail,
          password: TEST_PASSWORD
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setStatus(`Email ${emailType} envoyé avec succès!`);
      } else {
        setStatus(`Erreur: ${data.error}`);
      }
    } catch (error) {
      setStatus(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  const emailButtons = [
    { type: TherapyEmailType.RESERVATION, label: 'Confirmation de Réservation' },
    { type: TherapyEmailType.BEFORE_COUPLE_1, label: 'Avant Première Séance de Couple' },
    { type: TherapyEmailType.AFTER_COUPLE_1, label: 'Après Première Séance de Couple' },
    { type: TherapyEmailType.BEFORE_INDIV_1, label: 'Avant Première Séance Individuelle' },
    { type: TherapyEmailType.AFTER_INDIV_1, label: 'Après Première Séance Individuelle' },
    { type: TherapyEmailType.BEFORE_INDIV_2, label: 'Avant Deuxième Séance Individuelle' },
    { type: TherapyEmailType.AFTER_INDIV_2, label: 'Après Deuxième Séance Individuelle' },
    { type: TherapyEmailType.BEFORE_INDIV_3, label: 'Avant Troisième Séance Individuelle' },
    { type: TherapyEmailType.BEFORE_COUPLE_2, label: 'Avant Dernière Séance de Couple' },
    { type: TherapyEmailType.AFTER_COUPLE_2, label: 'Après Dernière Séance de Couple' }];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-8 text-center">Administration des Emails</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Connexion
            </button>
            {status && (
              <p className="text-red-500 text-center mt-2">{status}</p>
            )}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Timeline Section */}
        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-8 text-center">Parcours Thérapeutique</h2>
          <TherapyTimeline events={therapyJourneyEvents} />
        </div>

        {/* Email Testing Section */}
        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-8 text-center">Test des Emails</h2>

          <div className="mb-6">
            <label htmlFor="recipientEmail" className="block text-sm font-medium text-gray-700 mb-2">
              Email du Destinataire
            </label>
            <input
              type="email"
              id="recipientEmail"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 mb-4"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emailButtons.map(({ type, label }) => (
              <button
                key={type}
                onClick={() => handleSendEmail(type)}
                disabled={!recipientEmail}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-300"
              >
                {label}
              </button>
            ))}
          </div>

          {status && (
            <div className={`mt-6 p-4 rounded-md ${status.includes('Erreur') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
