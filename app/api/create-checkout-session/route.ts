import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'

// Ticket types and prices
const TICKET_PRICES = {
  standard: {
    amount: 4500, // 45 CHF in centimes
    name: 'Festival de la Poésie - Accès Standard'
  },
  vip: {
    amount: 8500, // 85 CHF in centimes
    name: 'Festival de la Poésie - Pack VIP'
  }
}

export async function POST(req: Request) {
  try {
    // Log environment variables (without exposing sensitive data)
    console.log('Environment check:', {
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      origin: req.headers.get('origin'),
    })

    const body = await req.json()
    const { ticketType, email } = body
    console.log('Request data:', { ticketType, email })

    const headersList = await headers()
    const origin = headersList.get('origin')
    console.log('Origin from headers:', origin)

    if (!ticketType || !email) {
      return NextResponse.json(
        { error: 'Ticket type and email are required' },
        { status: 400 }
      )
    }

    const price = TICKET_PRICES[ticketType as keyof typeof TICKET_PRICES]
    if (!price) {
      return NextResponse.json(
        { error: 'Invalid ticket type' },
        { status: 400 }
      )
    }

    // Initialize Stripe inside the handler
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-12-18.acacia'
    })

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'chf',
            product_data: {
              name: price.name,
              description: ticketType === 'vip'
                ? 'Accès au festival + Q&A exclusive + enregistrement 30 jours'
                : 'Accès au festival en direct'
            },
            unit_amount: price.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/prochainement?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/prochainement?canceled=true`,
      customer_email: email,
      metadata: {
        ticketType,
        email,
      }
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (err) {
    console.error('Error creating checkout session:', err)
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    )
  }
}
