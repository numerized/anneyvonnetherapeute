import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getCalendlyEventDetails, extractEventIdFromUri } from '@/lib/calendly';
import { Loader2 } from 'lucide-react';

export default function CalendlyEventExample() {
  const [eventUri, setEventUri] = useState<string>('');
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventUri) return;

    setLoading(true);
    setError(null);
    setEventDetails(null);

    try {
      // First, check if it's a full URI or just an event ID
      let uri = eventUri;
      if (!uri.includes('api.calendly.com')) {
        uri = `https://api.calendly.com/scheduled_events/${uri}`;
      }

      // Now fetch the event details
      const details = await getCalendlyEventDetails(uri);
      
      if (details) {
        setEventDetails(details);
      } else {
        setError('Aucun détail trouvé pour cet événement.');
      }
    } catch (err) {
      console.error('Error fetching event details:', err);
      setError('Erreur lors de la récupération des détails de l\'événement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Récupérer les détails d'un événement Calendly</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="eventUri" className="block text-sm font-medium mb-1">
            URI de l'événement ou ID
          </label>
          <Input
            id="eventUri"
            value={eventUri}
            onChange={(e) => setEventUri(e.target.value)}
            placeholder="https://api.calendly.com/scheduled_events/... ou simplement l'ID"
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Exemple: https://api.calendly.com/scheduled_events/4d762a3e-c54b-4004-af69-ba4568a69732
            <br />
            ou simplement: 4d762a3e-c54b-4004-af69-ba4568a69732
          </p>
        </div>
        
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Chargement...
            </>
          ) : (
            'Récupérer les détails'
          )}
        </Button>
      </form>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {eventDetails && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-semibold mb-3">Détails de l'événement</h2>
          
          <div className="space-y-2">
            <div>
              <span className="font-medium">Date et heure: </span>
              <span>{eventDetails.formattedDateTime}</span>
            </div>
            
            {eventDetails.eventName && (
              <div>
                <span className="font-medium">Nom de l'événement: </span>
                <span>{eventDetails.eventName}</span>
              </div>
            )}
            
            {eventDetails.location && (
              <div>
                <span className="font-medium">Lieu: </span>
                <span>{eventDetails.location}</span>
              </div>
            )}
            
            {eventDetails.invitee?.name && (
              <div>
                <span className="font-medium">Participant: </span>
                <span>{eventDetails.invitee.name}</span>
              </div>
            )}
            
            {eventDetails.invitee?.email && (
              <div>
                <span className="font-medium">Email: </span>
                <span>{eventDetails.invitee.email}</span>
              </div>
            )}
            
            {eventDetails.status && (
              <div>
                <span className="font-medium">Statut: </span>
                <span>{eventDetails.status}</span>
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <details>
              <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                Voir les données brutes (JSON)
              </summary>
              <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-80">
                {JSON.stringify(eventDetails.raw, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}
    </div>
  );
}
