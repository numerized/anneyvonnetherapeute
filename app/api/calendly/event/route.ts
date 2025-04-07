import axios from 'axios'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // Extract eventId from the request URL (using searchParams)
  const { searchParams } = new URL(request.url)
  const eventId = searchParams.get('eventId')

  console.log(`[Calendly API V2] Request for event details, ID: ${eventId}`)

  if (!eventId) {
    console.error('[Calendly API V2] No event ID provided in request')
    return NextResponse.json({ error: 'No event ID provided' }, { status: 400 })
  }

  // Construct the Calendly V2 API URL
  const eventUri = `https://api.calendly.com/scheduled_events/${eventId}`
  console.log(`[Calendly API V2] Requesting details from: ${eventUri}`)

  try {
    // Get Calendly API key from environment variables - try multiple possible environment variables
    // Order of preference: CALENDLY_API_KEY (V2) -> CALENDLY_CLIENT_SECRET (V1) -> NEXT_PUBLIC_CALENDLY_API_KEY (fallback)
    const apiKey =
      process.env.CALENDLY_API_KEY ||
      process.env.CALENDLY_CLIENT_SECRET ||
      process.env.NEXT_PUBLIC_CALENDLY_API_KEY

    // Debug the API key (only showing if it exists, not the actual key for security)
    console.log('[Calendly API V2] API key present:', !!apiKey)
    console.log(
      '[Calendly API V2] Using key from:',
      process.env.CALENDLY_API_KEY
        ? 'CALENDLY_API_KEY'
        : process.env.CALENDLY_CLIENT_SECRET
          ? 'CALENDLY_CLIENT_SECRET'
          : process.env.NEXT_PUBLIC_CALENDLY_API_KEY
            ? 'NEXT_PUBLIC_CALENDLY_API_KEY'
            : 'No key found',
    )

    if (!apiKey) {
      console.error('[Calendly API V2] Calendly API key is missing')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 },
      )
    }

    // Construct headers with the API key
    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // For V2 API, use Bearer token format if CALENDLY_API_KEY is present
    if (process.env.CALENDLY_API_KEY) {
      console.log(
        '[Calendly API V2] Using V2 API authentication format (Bearer token)',
      )
      headers['Authorization'] = `Bearer ${apiKey}`
    }
    // For V1 API or fallback, use the older token format
    else {
      console.log(
        '[Calendly API V2] Using V1 API authentication format or fallback',
      )
      headers['Authorization'] = `${apiKey}`
    }

    // Make the API request to Calendly V2 API
    console.log('[Calendly API V2] Sending request to Calendly API V2')
    const response = await axios.get(eventUri, {
      headers: headers,
    })

    console.log('[Calendly API V2] Response received:', response.status)

    // Add invitee details to the event data if they exist
    if (response.data && response.data.resource && response.data.resource.uri) {
      const eventResource = response.data.resource
      console.log(
        `[Calendly API V2] Successfully fetched event: ${eventResource.name || 'Unknown event'}`,
      )

      // The event doesn't include invitee by default, so let's try to get it
      try {
        // Construct the invitees API URL (V2 endpoint)
        const inviteesUri = `https://api.calendly.com/scheduled_events/${eventId}/invitees`
        console.log(`[Calendly API V2] Fetching invitees from: ${inviteesUri}`)

        const inviteesResponse = await axios.get(inviteesUri, {
          headers: headers,
        })

        // If we have invitees, add the first one to our response
        if (
          inviteesResponse.data &&
          inviteesResponse.data.collection &&
          inviteesResponse.data.collection.length > 0
        ) {
          const invitee = inviteesResponse.data.collection[0]
          console.log(`[Calendly API V2] Found invitee: ${invitee.email}`)

          // Add the invitee to our event data
          response.data.resource.invitee = {
            email: invitee.email,
            name: invitee.name,
            timezone: invitee.timezone,
            created_at: invitee.created_at,
            updated_at: invitee.updated_at,
            cancel_url: invitee.cancel_url,
            reschedule_url: invitee.reschedule_url,
            status: invitee.status,
            questions_and_answers: invitee.questions_and_answers,
            payment: invitee.payment,
          }
        } else {
          console.log('[Calendly API V2] No invitees found for this event')
        }
      } catch (inviteeError) {
        console.error(
          '[Calendly API V2] Error fetching invitee details:',
          inviteeError,
        )
        // Continue without invitee data
      }
    }

    // Return the event data
    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error(
      '[Calendly API V2] Error fetching Calendly event:',
      error.response?.data || error.message,
    )

    // Log more details about the error
    if (error.response) {
      console.error(
        `[Calendly API V2] Status: ${error.response.status}, Data:`,
        error.response.data,
      )

      // Special handling for 401 unauthorized errors
      if (error.response.status === 401) {
        console.error(
          '[Calendly API V2] 401 Unauthorized - API key is likely invalid or expired',
        )
        console.error(
          'For V2 API, make sure you are using a Personal Access Token, not the older API key',
        )

        // Provide detailed instructions for fixing the authentication issue
        return NextResponse.json(
          {
            error: 'Authentication failed with Calendly API V2',
            details:
              'The Calendly API token may be invalid, expired, or missing. For V2 API, you need to use a Personal Access Token.',
            instructions: `
1. Go to your Calendly account
2. Navigate to "Integrations" -> "API & Webhooks"
3. Create a new Personal Access Token
4. Add it to your .env.local file as CALENDLY_API_KEY=your_token_here
5. Restart your development server

Note: The client secret (${process.env.CALENDLY_CLIENT_SECRET ? 'currently configured' : 'not configured'}) is not sufficient for V2 API authentication.
`,
            message: error.message || null,
            debug: {
              envVars: {
                hasCalendlyApiKey: !!process.env.CALENDLY_API_KEY,
                hasCalendlyClientSecret: !!process.env.CALENDLY_CLIENT_SECRET,
                hasPublicCalendlyApiKey:
                  !!process.env.NEXT_PUBLIC_CALENDLY_API_KEY,
              },
            },
          },
          { status: 401 },
        )
      }
    }

    // Handle different error scenarios
    const status = error.response?.status || 500
    const errorMessage =
      error.response?.data?.message || 'Failed to fetch Calendly event details'

    return NextResponse.json(
      {
        error: errorMessage,
        details: error.response?.data || null,
        message: error.message || null,
      },
      { status },
    )
  }
}
