import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '../ui/button';
import { CalendlyEventDetailsView } from './CalendlyEventDetails';

interface RecentlyScheduledEventProps {
  eventUri: string;
  sessionTitle?: string;
  onDismiss?: () => void;
}

export function RecentlyScheduledEvent({ 
  eventUri, 
  sessionTitle = 'Séance', 
  onDismiss 
}: RecentlyScheduledEventProps) {
  const [dismissed, setDismissed] = useState(false);

  // Reset dismissed state when event URI changes
  useEffect(() => {
    setDismissed(false);
  }, [eventUri]);

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) onDismiss();
  };

  return (
    <div className="bg-primary-cream/20 border border-primary-cream/30 rounded-lg p-4 mb-6 animate-fadeIn">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-[rgb(247_237_226_)] font-semibold flex items-center mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {sessionTitle || 'Rendez-vous Programmé !'}
          </h3>
          <p className="text-[rgb(247_237_226_)] text-sm mb-3">
            Voici les détails de votre rendez-vous. Ils ont également été envoyés à votre adresse email.
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleDismiss}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4 text-[rgb(247_237_226_)]" />
        </Button>
      </div>
      <div className="bg-primary-cream/20 rounded-md border border-primary-cream/30">
        <CalendlyEventDetailsView eventUri={eventUri} />
      </div>
    </div>
  );
}
