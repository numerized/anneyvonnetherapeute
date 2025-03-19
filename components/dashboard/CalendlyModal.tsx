import axios from 'axios';
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
  minDate?: Date;
  maxDate?: Date;
  userEmail?: string;
  onAppointmentScheduled?: (eventData: any) => void;
  rescheduleUrl?: string; // Add reschedule URL for rescheduling sessions
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



// Calendly username (direct integration approach)
const CALENDLY_USERNAME = process.env.NEXT_PUBLIC_CALENDLY_USERNAME || 'numerized-ara'; // Update this with your Calendly username

export function CalendlyModal({ 
  isOpen, 
  onClose, 
  sessionType = '1h' as SessionType,
  minDate,
  maxDate,
  userEmail,
  onAppointmentScheduled,
  rescheduleUrl
}: CalendlyModalProps) {
  const [isCalendlyScriptLoaded, setIsCalendlyScriptLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [eventUri, setEventUri] = useState<string | null>(null);
  
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
      // Listen for both scheduled and rescheduled events from anywhere
      if (e.data.event === 'calendly.event_scheduled' || 
          e.data.event === 'calendly.event_rescheduled') {
        
        console.log('Calendly event detected from global listener:', e.data.event, e.data);
        
        // Try to prevent any default behavior that might cause page refresh
        if (e.preventDefault) e.preventDefault();
        if (e.stopPropagation) e.stopPropagation();
        
        // Extract the event URI and other details
        let eventUri = '';
        let startTime = '';
        
        if (e.data.payload?.event?.uri) {
          eventUri = e.data.payload.event.uri;
          startTime = e.data.payload.event.start_time || '';
        } else if (e.data.payload?.invitee?.scheduled_event?.uri) {
          eventUri = e.data.payload.invitee.scheduled_event.uri;
          startTime = e.data.payload.invitee.scheduled_event.start_time || '';
        } else if (e.data.payload?.invitee?.uri) {
          const inviteeUriParts = e.data.payload.invitee.uri.split('/');
          const inviteeId = inviteeUriParts[inviteeUriParts.length - 1];
          eventUri = inviteeId;
        }
        
        if (eventUri && onAppointmentScheduled) {
          // Prevent default to avoid any form submission
          e.data.preventDefault && e.data.preventDefault();
          
          // Call parent handler with event data
          onAppointmentScheduled({
            ...e.data,
            eventUri,
            startTime,
            isReschedule: e.data.event === 'calendly.event_rescheduled',
            newTime: new Date().toISOString()
          });
          
          // Close the modal immediately
          onClose();
          
          // Return false to prevent default behavior in older browsers
          return false;
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

    // If we have a reschedule URL, use that directly
    if (rescheduleUrl) {
      console.log(`Using reschedule URL in modal: ${rescheduleUrl}`);
      
      // Handle reschedule URL by redirecting the iframe to it
      const iframe = document.createElement('iframe');
      iframe.src = rescheduleUrl;
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.style.minHeight = isMobile ? '100vh' : '700px';
      
      // We don't need a separate event listener here as the global listener will catch all events
      container.appendChild(iframe);
      
      return;
    }
    
    // Otherwise, build URL parameters for date constraints for a new booking
    let dateParams = '';
    if (minDate) {
      console.log(`Modal received minDate: ${minDate.toISOString()}`);
      
      // Format date as YYYY-MM-DD without overriding with today's date
      const minDateFormatted = format(minDate, 'yyyy-MM-dd');
      dateParams += `&min_start_time=${encodeURIComponent(minDateFormatted)}`;
      console.log(`Setting min date for Calendly: ${minDateFormatted}`);
    }
    
    if (maxDate) {
      console.log(`Original maxDate: ${maxDate.toISOString()}`);
      
      // Format date as YYYY-MM-DD
      const maxDateFormatted = format(maxDate, 'yyyy-MM-dd');
      dateParams += `&max_start_time=${encodeURIComponent(maxDateFormatted)}`;
      console.log(`Setting max date: ${maxDateFormatted}`);
    }
    
    if (userEmail) {
      dateParams += `&email=${encodeURIComponent(userEmail)}`;
    }

    // Configure Calendly for this session type
    const eventTypeSlug = "1h";
    console.log(`Using Calendly event type: ${eventTypeSlug} for session type: ${sessionType}`);

    // Full Calendly URL with parameters
    const calendlyUrl = `https://calendly.com/${CALENDLY_USERNAME}/${eventTypeSlug}?hide_landing_page_details=1&hide_gdpr_banner=1&hide_event_type_details=1${dateParams}`;
    console.log(`Initializing Calendly with URL: ${calendlyUrl}`);

    // Initialize Calendly inline widget
    window.Calendly.initInlineWidget({
      url: calendlyUrl,
      parentElement: container,
      prefill: userEmail ? { email: userEmail } : undefined,
      utm: {
        utmSource: 'therapy_journey_dashboard'
      },
      styles: {
        height: '100%',
        minHeight: isMobile ? '100vh' : '700px',
      }
    });

    // Add event listener for scheduling using the window.message event
    // window.addEventListener('message', handleCalendlyMessage);
  }, [isCalendlyScriptLoaded, minDate, maxDate, userEmail, sessionType, isMobile, rescheduleUrl]);

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

  // Cleanup widget when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setEventUri(null);
    }
  }, [isOpen]);

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
        <div className="flex items-center justify-between p-4 md:p-6 border-b">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-800">
            {sessionType?.includes('individual_male') && 'Séance Individuelle Homme'}
            {sessionType?.includes('individual_female') && 'Séance Individuelle Femme'}
            {sessionType?.includes('initial') && 'Première Séance de Couple'}
            {sessionType?.includes('final') && 'Séance Finale de Couple'}
            {!sessionType?.includes('individual_male') && !sessionType?.includes('individual_female') && 
             !sessionType?.includes('initial') && !sessionType?.includes('final') && 'Prendre Rendez-vous'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-coral"
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
        prefill?: { email?: string };
        utm?: Record<string, string>;
        styles?: Record<string, string>;
      }) => void;
    };
  }
}
