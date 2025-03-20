import axios from 'axios';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Interface for Calendly event details (V2 API)
 */
export interface CalendlyEventDetails {
  startTime: string;
  endTime: string;
  formattedDateTime: string;
  location?: {
    type?: string;
    location?: string;
    join_url?: string;
  };
  eventType?: string;
  status?: string;
  uri: string;
  eventName?: string;
  invitee?: {
    email?: string;
    name?: string;
    timezone?: string;
    created_at?: string;
    updated_at?: string;
    cancel_url?: string;
    reschedule_url?: string;
    status?: string;
    questions_and_answers?: Array<{
      question?: string;
      answer?: string;
    }>;
    payment?: any;
  };
  raw?: any; // The raw event data
}

/**
 * Extracts the event ID from a Calendly URI (V2 API)
 * @param uri Calendly URI like https://api.calendly.com/scheduled_events/4d762a3e-c54b-4004-af69-ba4568a69732
 * @returns Event ID string
 */
export function extractEventIdFromUri(uri: string): string | null {
  if (!uri) return null;
  
  // Try to extract using the V2 API format
  const match = uri.match(/scheduled_events\/([a-f0-9-]+)/i);
  if (match && match[1]) {
    return match[1];
  }
  
  // If it's already an ID (UUID format), just return it
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(uri)) {
    return uri;
  }
  
  console.error('Could not extract event ID from URI:', uri);
  return null;
}

/**
 * Fetches Calendly event details using our API route (V2 API)
 * @param eventUri Full Calendly event URI or just the event ID
 * @returns Formatted event details or null if error
 */
export async function getCalendlyEventDetails(eventUri: string): Promise<CalendlyEventDetails | null> {
  try {
    // Log the incoming parameter
    console.log('Getting Calendly event details for:', eventUri);
    
    // Extract event ID from URI if full URI is provided
    const eventId = eventUri.includes('api.calendly.com') 
      ? extractEventIdFromUri(eventUri)
      : eventUri;
    
    if (!eventId) {
      console.error('Invalid Calendly event URI');
      return null;
    }

    console.log(`Extracted event ID: ${eventId}, calling API route`);
    
    // Call our API route
    const response = await axios.get(`/api/calendly/event?eventId=${eventId}`);
    
    // Log raw response
    console.log('Raw API response:', JSON.stringify(response.data, null, 2));
    
    const eventData = response.data.resource;
    
    if (!eventData) {
      console.error('No event data returned from API');
      return null;
    }

    console.log('Processing event data:', eventData);

    // Format dates
    const startTime = new Date(eventData.start_time);
    const endTime = new Date(eventData.end_time);
    
    // Format the date in a more readable French format, including day of week
    const formattedStartTime = format(startTime, "EEEE d MMMM yyyy 'à' HH'h'mm", { locale: fr });
    const formattedEndTime = format(endTime, "HH'h'mm", { locale: fr });
    
    // Capitalize first letter of the day
    const capitalizedStartTime = formattedStartTime.charAt(0).toUpperCase() + formattedStartTime.slice(1);
    
    // Create result object
    const result: CalendlyEventDetails = {
      startTime: eventData.start_time,
      endTime: eventData.end_time,
      formattedDateTime: `${capitalizedStartTime} - ${formattedEndTime}`,
      location: eventData.location,
      eventType: eventData.event_type,
      status: eventData.status,
      uri: eventData.uri,
      eventName: eventData.name,
      invitee: eventData.invitee && {
        email: eventData.invitee.email,
        name: eventData.invitee.name,
        timezone: eventData.invitee.timezone,
        created_at: eventData.invitee.created_at,
        updated_at: eventData.invitee.updated_at,
        cancel_url: eventData.invitee.cancel_url,
        reschedule_url: eventData.invitee.reschedule_url,
        status: eventData.invitee.status,
        questions_and_answers: eventData.invitee.questions_and_answers,
        payment: eventData.invitee.payment
      },
      raw: eventData
    };
    
    console.log('Returning formatted event details:', result);
    return result;
  } catch (error: any) {
    // Enhanced error logging
    if (error.response) {
      // Server responded with a status code that falls out of the range of 2xx
      console.error('Error fetching Calendly event details:');
      console.error(`Status: ${error.response.status}`);
      console.error('Response data:', error.response.data);
      
      // Specific handling for common errors
      if (error.response.status === 401) {
        console.error('Authentication error: The Calendly API key is likely invalid or expired');
        console.error('Please check that the API key is correctly set in the environment variables');
        console.error('For V2 API, you need to use a Personal Access Token, not the older API key');
      } else if (error.response.status === 404) {
        console.error('Event not found: The Calendly event ID may be invalid or the event has been deleted');
      }
    } else if (error.request) {
      // Request was made but no response was received
      console.error('Error fetching Calendly event details: No response received from server');
      console.error(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request to fetch Calendly event details:', error.message);
    }
    
    // Additionally log the config for debugging
    if (error.config) {
      console.error('Error configuration:', {
        url: error.config.url,
        method: error.config.method,
        headers: error.config.headers ? 'Headers present (not shown for security)' : 'No headers',
      });
    }
    
    return null;
  }
}
