import axios from 'axios';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

// Re-export the SessionType for backward compatibility
export type SessionType = 
  | 'initial_couple' 
  | 'individual_male_1' 
  | 'individual_male_2' 
  | 'individual_male_3'
  | 'individual_female_1'
  | 'individual_female_2'
  | 'individual_female_3'
  | 'final_couple';

type CalendlyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  sessionType: SessionType;
  onEventScheduled?: (eventDetails: any) => void;
  minDate?: Date;
  maxDate?: Date;
  userEmail?: string;
};

// Define session titles for different session types
const SESSION_TITLES: Record<SessionType, string> = {
  initial_couple: 'Séance Initiale de Couple',
  individual_male_1: 'Séance Individuelle Homme 1',
  individual_male_2: 'Séance Individuelle Homme 2',
  individual_male_3: 'Séance Individuelle Homme 3',
  individual_female_1: 'Séance Individuelle Femme 1',
  individual_female_2: 'Séance Individuelle Femme 2',
  individual_female_3: 'Séance Individuelle Femme 3',
  final_couple: 'Séance Finale de Couple'
};

// Map session types to Calendly event type slugs (you may need to update these)
const SESSION_TYPE_MAPPING: Record<SessionType, string> = {
  initial_couple: 'initial-couple',  // Update this to match your Calendly event type slug
  individual_male_1: 'individual-session-male',
  individual_male_2: 'individual-session-male',
  individual_male_3: 'individual-session-male',
  individual_female_1: 'individual-session-female',
  individual_female_2: 'individual-session-female',
  individual_female_3: 'individual-session-female',
  final_couple: 'final-couple'
};

// Calendly username (direct integration approach)
const CALENDLY_USERNAME = process.env.NEXT_PUBLIC_CALENDLY_USERNAME || 'numerized'; // Update this with your Calendly username

export function CalendlyModal({ 
  isOpen,
  onClose,
  sessionType,
  onEventScheduled,
  minDate,
  maxDate,
  userEmail
}: CalendlyModalProps) {
  const [isCalendlyScriptLoaded, setIsCalendlyScriptLoaded] = useState<boolean>(false);

  // Define a custom type for Calendly events
  type CalendlyEventData = {
    event: string;
    payload: any;
  };

  // Define event scheduled handler
  const handleEventScheduled = useCallback((eventData: CalendlyEventData) => {
    console.log('Calendly event scheduled!', eventData);
    
    // Call the callback with event details
    if (onEventScheduled) {
      onEventScheduled(eventData.payload);
    }
    
    // Close the modal
    onClose();
  }, [onEventScheduled, onClose]);

  // Handle Calendly messages
  const handleCalendlyMessage = useCallback((event: MessageEvent) => {
    if (event.origin !== 'https://calendly.com') return;
    
    // Log all message events from Calendly for debugging
    console.log('Received message from Calendly:', event.data);
    
    if (event.data.event && event.data.event === 'calendly.event_scheduled') {
      console.log('Event scheduled event details:', JSON.stringify(event.data, null, 2));
      
      // Extract and log the event URI from various possible locations in the data structure
      let eventUri = null;
      
      // Try to extract from payload
      if (event.data.payload?.event?.uri) {
        eventUri = event.data.payload.event.uri;
        console.log('Found event URI in payload.event.uri:', eventUri);
      } 
      // Also check invitee.scheduled_event if present
      else if (event.data.payload?.invitee?.scheduled_event?.uri) {
        eventUri = event.data.payload.invitee.scheduled_event.uri;
        console.log('Found event URI in payload.invitee.scheduled_event.uri:', eventUri);
      }
      
      if (eventUri) {
        // Ensure the full event data being passed has the URI accessible at the top level 
        // for easier processing in the parent component
        const enhancedData = {
          ...event.data,
          eventUri: eventUri,
          payload: {
            ...event.data.payload,
            event: {
              ...(event.data.payload?.event || {}),
              uri: eventUri
            }
          }
        };
        
        console.log('Enhanced event data with extracted URI:', enhancedData);
        handleEventScheduled(enhancedData);
      } else {
        console.warn('Could not find event URI in Calendly event data');
        handleEventScheduled(event.data);
      }
    }
  }, [handleEventScheduled]);

  // Cleanup function
  const cleanupCalendlyWidget = useCallback(() => {
    // Remove event listener
    window.removeEventListener('message', handleCalendlyMessage);
    
    // Clear widget container
    const container = document.getElementById('calendly-container');
    if (container) {
      container.innerHTML = '';
    }
  }, [handleCalendlyMessage]);

  // Initialize widget function
  const initializeCalendlyWidget = useCallback(() => {
    if (!window.Calendly || !isCalendlyScriptLoaded) return;

    // Get the element to populate
    const container = document.getElementById('calendly-container');
    if (!container) return;

    // Clear any previous widgets
    container.innerHTML = '';

    // Build URL parameters for date constraints
    let dateParams = '';
    if (minDate) {
      dateParams += `&min_start_time=${encodeURIComponent(minDate.toISOString())}`;
    }
    if (maxDate) {
      dateParams += `&max_start_time=${encodeURIComponent(maxDate.toISOString())}`;
    }
    if (userEmail) {
      dateParams += `&email=${encodeURIComponent(userEmail)}`;
    }

    // Configure Calendly for this session type
    const eventTypeSlug = "1h"; // Always use 1h event type

    // Initialize Calendly inline widget
    window.Calendly.initInlineWidget({
      url: `https://calendly.com/${CALENDLY_USERNAME}/${eventTypeSlug}?hide_landing_page_details=1&hide_gdpr_banner=1${dateParams}`,
      parentElement: container,
      prefill: userEmail ? { email: userEmail } : undefined,
      utm: {
        utmSource: 'therapy_journey_dashboard'
      },
      styles: {
        height: '100%'
      }
    });

    // Add event listener for scheduling using the window.message event
    window.addEventListener('message', handleCalendlyMessage);
  }, [isCalendlyScriptLoaded, minDate, maxDate, userEmail, handleCalendlyMessage]);

  // Load Calendly script
  useEffect(() => {
    if (!isOpen) return;

    // Only load script if it's not already loaded
    if (!document.getElementById('calendly-script') && !isCalendlyScriptLoaded) {
      const script = document.createElement('script');
      script.id = 'calendly-script';
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.onload = () => setIsCalendlyScriptLoaded(true);
      document.body.appendChild(script);
    } else if (isCalendlyScriptLoaded) {
      // Initialize Calendly inline widget when script is loaded
      initializeCalendlyWidget();
    }

    // Clean up
    return () => {
      cleanupCalendlyWidget();
    };
  }, [isOpen, isCalendlyScriptLoaded, initializeCalendlyWidget, cleanupCalendlyWidget]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 ${
        isOpen ? '' : 'hidden'
      }`}
    >
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-primary-cream/10 rounded-lg shadow-lg z-10 w-full h-full max-h-screen overflow-hidden flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-[rgb(247_237_226)]">
            {SESSION_TITLES[sessionType] || 'Prendre un rendez-vous'}
          </h2>
          <button
            className="text-[rgb(247_237_226)] hover:text-[rgb(247_237_226)]"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Calendly inline widget will be loaded here */}
        <div id="calendly-container" className="flex-grow w-full"></div>
      </div>
    </div>
  );
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
