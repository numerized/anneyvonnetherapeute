import axios from 'axios'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // Extract eventUri from the request URL
  const { searchParams } = new URL(request.url)
  const eventUri = searchParams.get('eventUri')

  console.log(`[Calendly API] Request for event details, URI: ${eventUri}`)

  if (!eventUri) {
    console.error('[Calendly API] No event URI provided in request')
    return NextResponse.json(
      { error: 'No event URI provided' },
      { status: 400 },
    )
  }

  try {
    // Get Calendly API key from environment variables
    const apiKey =
      process.env.CALENDLY_API_KEY ||
      process.env.CALENDLY_CLIENT_SECRET ||
      process.env.NEXT_PUBLIC_CALENDLY_API_KEY

    console.log('[Calendly API] API key present:', !!apiKey)

    if (!apiKey) {
      console.error('[Calendly API] Calendly API key is missing')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 },
      )
    }

    // Extract event ID from the URI
    // The URI format is like: https://api.calendly.com/scheduled_events/64ac45f5-008d-461b-8293-1c615aa4bfe3
    let eventId = eventUri

    // If it's a full URI, extract just the ID
    if (eventUri.includes('/')) {
      eventId = eventUri.split('/').pop() || ''
    }

    console.log(`[Calendly API] Extracted event ID: ${eventId}`)

    // Construct the Calendly API URL
    const fullEventUri = `https://api.calendly.com/scheduled_events/${eventId}`
    console.log(`[Calendly API] Requesting details from: ${fullEventUri}`)

    // Construct headers with the API key
    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // For V2 API, use Bearer token format
    if (process.env.CALENDLY_API_KEY) {
      console.log(
        '[Calendly API] Using V2 API authentication format (Bearer token)',
      )
      headers['Authorization'] = `Bearer ${apiKey}`
    }
    // For V1 API or fallback, use the older token format
    else {
      console.log(
        '[Calendly API] Using V1 API authentication format or fallback',
      )
      headers['Authorization'] = `${apiKey}`
    }

    // Make the API request to Calendly API
    console.log('[Calendly API] Sending request to Calendly API')
    const response = await axios.get(fullEventUri, {
      headers: headers,
    })

    console.log('[Calendly API] Response received:', response.status)

    // Add invitee details if they exist
    if (response.data && response.data.resource && response.data.resource.uri) {
      const eventResource = response.data.resource
      console.log(
        `[Calendly API] Successfully fetched event: ${eventResource.name || 'Unknown event'}`,
      )

      // The event doesn't include invitee by default, so let's try to get it
      try {
        // Construct the invitees API URL
        const inviteesUri = `https://api.calendly.com/scheduled_events/${eventId}/invitees`
        console.log(`[Calendly API] Fetching invitees from: ${inviteesUri}`)

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
          console.log(`[Calendly API] Found invitee: ${invitee.email}`)

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
          console.log('[Calendly API] No invitees found for this event')
        }
      } catch (inviteeError) {
        console.error(
          '[Calendly API] Error fetching invitee details:',
          inviteeError,
        )
      }
    }

    // Return the event data
    return NextResponse.json({
      success: true,
      data: response.data.resource,
    })
  } catch (error: any) {
    console.error('[Calendly API] Error fetching event details:', error.message)
    console.error(
      '[Calendly API] Error details:',
      error.response?.data || 'No detailed error information',
    )

    return NextResponse.json(
      {
        error: 'Failed to fetch Calendly event details',
        details: error.message,
        response: error.response?.data,
      },
      { status: error.response?.status || 500 },
    )
  }
}
