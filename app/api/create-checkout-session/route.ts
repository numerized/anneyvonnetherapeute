import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia'
})

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
    const body = await req.json()
    const { ticketType, email } = body
    const headersList = await headers()
    const origin = headersList.get('origin')

    if (!ticketType || !email || !TICKET_PRICES[ticketType]) {
      return NextResponse.json(
        { error: 'Invalid ticket type or missing email' },
        { status: 400 }
      )
    }

    const ticket = TICKET_PRICES[ticketType]

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'chf',
            product_data: {
              name: ticket.name,
              description: ticketType === 'vip'
                ? 'Accès au festival + Q&A exclusive + enregistrement 30 jours'
                : 'Accès au festival en direct'
            },
            unit_amount: ticket.amount,
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
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
