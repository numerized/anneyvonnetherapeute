// React imports
// Third-party imports
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Edit, ExternalLink, Info, MapPin, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';

// Local imports
import { CalendlyEventDetails,getCalendlyEventDetails } from '@/lib/calendly';

interface CalendlyEventDetailsProps {
  eventUri: string;
}

export function CalendlyEventDetailsView({ eventUri }: CalendlyEventDetailsProps) {
  const [eventDetails, setEventDetails] = useState<CalendlyEventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEventDetails() {
      if (!eventUri) {
        setError('No event URI provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const details = await getCalendlyEventDetails(eventUri);
        setEventDetails(details);
        setError(null);
      } catch (err) {
        console.error('Error fetching Calendly event details:', err);
        setError('Impossible de récupérer les détails du rendez-vous');
      } finally {
        setLoading(false);
      }
    }

    fetchEventDetails();
  }, [eventUri]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary-coral border-r-2"></div>
        <span className="ml-2 text-sm text-[rgb(247_237_226_)]/70">Chargement des détails...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-[rgb(247_237_226_)]/70 p-4 text-sm">
        <p>{error}</p>
      </div>
    );
  }

  if (!eventDetails) {
    return (
      <div className="text-[rgb(247_237_226_)]/70 p-4 text-sm">
        <p>Aucune information disponible sur ce rendez-vous</p>
      </div>
    );
  }

  // Get the raw data if available for more details
  const raw = eventDetails.raw || {};
  const invitee = eventDetails.invitee || {};

  return (
    <div className="p-4 text-sm divide-y divide-[rgb(247_237_226_)]/10">
      {/* Date and time */}
      <div className="flex items-start py-2">
        <Calendar className="w-4 h-4 mr-3 text-primary-coral mt-0.5" />
        <div>
          <p className="font-medium text-[rgb(247_237_226_)]">Date et Heure</p>
          <p className="text-[rgb(247_237_226_)]/80">{eventDetails.formattedDateTime}</p>
        </div>
      </div>
      
      {/* Location */}
      <div className="flex items-start py-2">
        <MapPin className="w-4 h-4 mr-3 text-primary-coral mt-0.5" />
        <div>
          <p className="font-medium text-[rgb(247_237_226_)]">Lieu</p>
          <p className="text-[rgb(247_237_226_)]/80">
            Vidéoconférence Whereby
          </p>
          <a 
            href="https://whereby.com/coeur-a-corps"
            target="_blank"
            rel="noopener noreferrer" 
            className="text-primary-coral hover:underline mt-1 inline-block"
          >
            <ExternalLink className="w-3 h-3 inline mr-1" />
            Rejoindre la vidéoconférence
          </a>
        </div>
      </div>
      
      {/* Type of session */}
      <div className="flex items-start py-2">
        <Info className="w-4 h-4 mr-3 text-primary-coral mt-0.5" />
        <div>
          <p className="font-medium text-[rgb(247_237_226_)]">Type de séance</p>
          <p className="text-[rgb(247_237_226_)]/80">{raw.name || eventDetails.eventType || 'Rendez-vous'}</p>
        </div>
      </div>
      
      {/* Participant info */}
      {invitee && (invitee.email || invitee.name) && (
        <div className="flex items-start py-2">
          <User className="w-4 h-4 mr-3 text-primary-coral mt-0.5" />
          <div>
            <p className="font-medium text-[rgb(247_237_226_)]">Participant</p>
            {invitee.name && <p className="text-[rgb(247_237_226_)]/80">{invitee.name}</p>}
            {invitee.email && <p className="text-[rgb(247_237_226_)]/60 text-xs">{invitee.email}</p>}
          </div>
        </div>
      )}
      
      {/* Management links */}
      <div className="flex items-start py-2">
        <Edit className="w-4 h-4 mr-3 text-primary-coral mt-0.5" />
        <div>
          <p className="font-medium text-[rgb(247_237_226_)]">Gérer ce rendez-vous</p>
          <div className="mt-1 space-y-1">
            {invitee.reschedule_url && (
              <a 
                href={invitee.reschedule_url}
                target="_blank"
                rel="noopener noreferrer" 
                className="text-[rgb(247_237_226_)]/80 hover:underline block text-xs"
              >
                <Calendar className="w-3 h-3 inline mr-1" />
                Reprogrammer ce rendez-vous
              </a>
            )}
            {invitee.cancel_url && (
              <a 
                href={invitee.cancel_url}
                target="_blank"
                rel="noopener noreferrer" 
                className="text-[rgb(247_237_226_)]/60 hover:underline block text-xs"
              >
                <X className="w-3 h-3 inline mr-1" />
                Annuler ce rendez-vous
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Simplified version that just shows date and time
export function CalendlyEventDateTime({ eventUri }: CalendlyEventDetailsProps) {
  const [loading, setLoading] = useState(true);
  const [eventDetails, setEventDetails] = useState<CalendlyEventDetails | null>(null);

  useEffect(() => {
    async function fetchEventDetails() {
      if (!eventUri) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const details = await getCalendlyEventDetails(eventUri);
        setEventDetails(details);
      } catch (err) {
        console.error('Error fetching event details:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchEventDetails();
  }, [eventUri]);

  if (loading) {
    return <span className="text-[rgb(247_237_226_)]/70 text-sm">Chargement...</span>;
  }

  if (!eventDetails) {
    return <span className="text-[rgb(247_237_226_)]/70 text-sm">Date indisponible</span>;
  }

  return <span className="text-[rgb(247_237_226_)]">{eventDetails.formattedDateTime}</span>;
}
