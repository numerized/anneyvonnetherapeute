import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

// Re-export the SessionType for backward compatibility
export type SessionType = 
  | 'initial' 
  | 'individual_male_1' 
  | 'individual_male_2' 
  | 'individual_male_3'
  | 'individual_female_1'
  | 'individual_female_2'
  | 'individual_female_3'
  | 'final'
  | '1h';

// Props interface
export interface CalendlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionType: SessionType;
  userEmail?: string;
  onAppointmentScheduled?: (eventData: any) => void;
  minDate?: Date;
}

// Define session titles for different session types
const SESSION_TITLES: Record<SessionType, string> = {
  initial: 'Séance Initiale de Couple',
  individual_male_1: 'Séance Individuelle Homme 1',
  individual_male_2: 'Séance Individuelle Homme 2',
  individual_male_3: 'Séance Individuelle Homme 3',
  individual_female_1: 'Séance Individuelle Femme 1',
  individual_female_2: 'Séance Individuelle Femme 2',
  individual_female_3: 'Séance Individuelle Femme 3',
  final: 'Séance Finale de Couple',
  '1h': '1h'
};

// Calendly URL (direct integration approach)
const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/numerized-ara/1h';

export function CalendlyModal({ 
  isOpen, 
  onClose, 
  sessionType = '1h' as SessionType,
  userEmail,
  onAppointmentScheduled,
  minDate
}: CalendlyModalProps) {
  const [isCalendlyScriptLoaded, setIsCalendlyScriptLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Detect if the current device is mobile
  const isMobile = useIsMobile();

  // Initialize Calendly script
  useEffect(() => {
    setIsMounted(true);
    
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = () => setIsCalendlyScriptLoaded(true);
    
    document.body.appendChild(script);
    
    // Add global event listener for Calendly messages
    window.addEventListener('message', (e) => {
      // Only listen for scheduled events
      if (e.data.event === 'calendly.event_scheduled') {
        console.log('Calendly event scheduled:', e.data);
        
        // Extract the event URI
        const eventUri = e.data.payload?.event?.uri || '';
        
        if (eventUri && onAppointmentScheduled) {
          // Call parent handler with event data
          onAppointmentScheduled({
            ...e.data,
            eventUri,
            newTime: new Date().toISOString()
          });
          
          // Close the modal
          onClose();
        }
      }
    });
    
    return () => {
      // We don't remove the global message listener to avoid potential issues
      // with other event listeners during component unmount
    };
  }, [onAppointmentScheduled, onClose]);

  // Initialize widget function
  const initializeCalendlyWidget = useCallback(() => {
    if (!window.Calendly || !isCalendlyScriptLoaded) return;

    // Get the element to populate
    const container = document.getElementById('calendly-container');
    if (!container) return;

    // Clear any previous widgets
    container.innerHTML = '';
    
    // Build URL parameters
    let urlParams = '';
    if (userEmail) {
      urlParams += `&email=${encodeURIComponent(userEmail)}`;
    }

    // Use the single Calendly URL from environment variable
    const calendlyUrl = `${CALENDLY_URL}?hide_landing_page_details=1&hide_gdpr_banner=1&hide_event_type_details=1${urlParams}`;
    console.log(`Initializing Calendly with URL: ${calendlyUrl}`);

    // Initialize Calendly inline widget
    window.Calendly.initInlineWidget({
      url: calendlyUrl,
      parentElement: container,
      prefill: {
        name: SESSION_TITLES[sessionType],
        email: userEmail
      },
      utm: {
        utmSource: 'therapy_journey_dashboard'
      },
      styles: {
        height: isMobile ? '100vh' : '700px'
      }
    });
  }, [isCalendlyScriptLoaded, userEmail, isMobile, sessionType]);

  // Initialize Calendly when modal is opened
  useEffect(() => {
    if (isOpen && isMounted) {
      // Delay initialization to ensure the modal is fully rendered
      const timer = setTimeout(() => {
        initializeCalendlyWidget();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMounted, initializeCalendlyWidget]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50 flex items-center justify-center">
      <div 
        className={`relative bg-white rounded-lg shadow-xl flex flex-col overflow-hidden ${
          isMobile 
            ? 'w-full h-full max-w-full max-h-full rounded-none' 
            : 'w-[95%] max-w-5xl mx-auto h-[90vh] max-h-[900px]'
        }`}
      >
        <div className="flex flex-col items-start justify-between p-4 md:p-6 border-b">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-800">
            {sessionType?.includes('individual_male') && 'Séance Individuelle Homme'}
            {sessionType?.includes('individual_female') && 'Séance Individuelle Femme'}
            {sessionType?.includes('initial') && 'Première Séance de Couple'}
            {sessionType?.includes('final') && 'Séance Finale de Couple'}
            {!sessionType?.includes('individual_male') && !sessionType?.includes('individual_female') && 
             !sessionType?.includes('initial') && !sessionType?.includes('final') && 'Prendre Rendez-vous'}
          </h3>
          {minDate && !sessionType?.includes('initial') && (
            <p className="text-red-500 text-sm mt-2"><b>
              !!! ATTENTION: CHOISISSEZ UNE DATE APRES LE {format(minDate, 'EEEE d MMMM yyyy', { locale: fr })}
            </b></p>
          )}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-coral"
          >
            <X className="w-6 h-6" />
            <span className="sr-only">Fermer</span>
          </button>
        </div>
        
        <div id="calendly-container" className="flex-grow w-full overflow-hidden" />
      </div>
    </div>
  );
}

// Custom hook to detect mobile devices
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check initially
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  return isMobile;
}

// Add type definition for Calendly widget
declare global {
  interface Window {
    Calendly: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
        prefill?: { email?: string; name?: string };
        utm?: Record<string, string>;
        styles?: Record<string, string>;
      }) => void;
    };
  }
}
