import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'

// Ticket types and prices
const TICKET_PRICES = {
  standard: {
    amount: {
      chf: 11100, // 111 CHF in centimes
      eur: 11100  // 111 EUR in cents
    },
    name: 'Formation - Mieux vivre l\'autre | Anne-Yvonne Racine (coeur-a-corps.org)'
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
    const { ticketType, email, currency, discount, couponCode } = body
    console.log('Request data:', { ticketType, email, currency, discount, couponCode })

    const headersList = await headers()
    const origin = headersList.get('origin')
    console.log('Origin from headers:', origin)

    if (!ticketType || !email || !currency) {
      return NextResponse.json(
        { error: 'Ticket type, email, and currency are required' },
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

    // Calculate discounted amount if applicable
    const baseAmount = price.amount[currency.toLowerCase() as keyof typeof price.amount]
    const finalAmount = discount ? Math.round(baseAmount * (1 - discount / 100)) : baseAmount

    // Initialize Stripe inside the handler
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      //@ts-ignore
      apiVersion: '2024-12-18.acacia'
    })

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: price.name,
              description: discount > 0 ? `Accès à la formation en direct (Code promo : ${couponCode})` : 'Accès à la formation en direct'
            },
            unit_amount: finalAmount,
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
        currency: currency.toLowerCase(),
        discount: discount ? discount.toString() : '0',
        couponCode: couponCode || ''
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
