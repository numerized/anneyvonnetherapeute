'use client';

import { X } from 'lucide-react';
import { InlineWidget, useCalendlyEventListener } from 'react-calendly';

export type SessionType = 'initial_couple' | 'individual_partner1' | 'individual_partner2' | 'final_couple';

interface CalendlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventScheduled: (eventData?: any) => void;
  sessionType: SessionType;
  minDate?: Date;
  maxDate?: Date;
  userEmail?: string;
}

// Single URL for all session types
const CALENDLY_BASE_URL = 'https://calendly.com/numerized-ara/';

// Session duration mapping (in minutes)
const SESSION_DURATIONS = {
  initial_couple: 60,
  individual_partner1: 60,
  individual_partner2: 60,
  final_couple: 60
};

// Session titles for Calendly event
const SESSION_TITLES = {
  initial_couple: 'Première Séance de Couple',
  individual_partner1: 'Séance Individuelle - Partenaire 1',
  individual_partner2: 'Séance Individuelle - Partenaire 2',
  final_couple: 'Séance Finale de Couple'
};

export function CalendlyModal({ 
  isOpen, 
  onClose, 
  onEventScheduled,
  sessionType,
  minDate,
  maxDate,
  userEmail 
}: CalendlyModalProps) {
  useCalendlyEventListener({
    onEventScheduled: (e) => {
      // Log the raw Calendly event data for debugging
      console.log('Calendly event raw data:', e);
      
      // Make sure we have the event data properly structured
      // Handle both possible event data structures that Calendly might send
      const eventData = {
        data: {
          event: e?.data?.event || e?.payload?.event || {},
          invitee: e?.data?.invitee || e?.payload?.invitee || {}
        }
      };
      
      // Log the processed event data
      console.log('Processed Calendly event data:', eventData);
      
      // Pass the event data to the parent component
      onEventScheduled(eventData);
      onClose();
    }
  });

  if (!isOpen) return null;

  const getCalendlyUrl = () => {
    const baseUrl = CALENDLY_BASE_URL;
    const params = new URLSearchParams();
    
    // Add session type as a custom parameter
    params.append('session_type', sessionType);
    
    // Add title to identify session type in Calendly
    params.append('name', SESSION_TITLES[sessionType]);
    
    // Set duration for the session type
    params.append('duration', SESSION_DURATIONS[sessionType].toString());
    
    // Pre-fill email if available
    if (userEmail) {
      params.append('email', userEmail);
    }
    
    // Add date constraints
    if (minDate) {
      params.append('min_start_time', minDate.toISOString());
    }
    if (maxDate) {
      params.append('max_start_time', maxDate.toISOString());
    }
    
    const queryString = params.toString();
    return `${baseUrl}?${queryString}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-3xl h-[80vh] rounded-lg overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-gray-600 hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
        <InlineWidget 
          url={getCalendlyUrl()}
          styles={{ height: '100%', width: '100%' }}
        />
      </div>
    </div>
  );
}
