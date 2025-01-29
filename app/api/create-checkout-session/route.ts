import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'

// Ticket types and prices
const TICKET_PRICES = {
  standard: {
    prochainement: {
      amount: {
        chf: 99900, // 999 CHF in centimes
        eur: 99900  // 999 EUR in cents
      },
      discountedAmount: {
        chf: 89900, // 899 CHF in centimes
        eur: 89900  // 899 EUR in cents
      },
      name: 'Formation - Mieux vivre l\'autre | Anne-Yvonne Racine (coeur-a-corps.org)'
    },
    webinar: {
      amount: {
        chf: 100, // 1 CHF in centimes
        eur: 100  // 1 EUR in cents
      },
      name: 'Webinar - Mieux vivre l\'autre | Anne-Yvonne Racine (coeur-a-corps.org)'
    }
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
    const { ticketType, email, currency, hasDiscount, couponCode, productType = 'prochainement' } = body
    console.log('Request data:', { ticketType, email, currency, hasDiscount, couponCode, productType })

    const headersList = await headers()
    const origin = headersList.get('origin')
    console.log('Origin from headers:', origin)

    if (!ticketType || !email || !currency) {
      return NextResponse.json(
        { error: 'Ticket type, email, and currency are required' },
        { status: 400 }
      )
    }

    const productConfig = TICKET_PRICES[ticketType as keyof typeof TICKET_PRICES]?.[productType]
    if (!productConfig) {
      return NextResponse.json(
        { error: 'Invalid ticket type or product type' },
        { status: 400 }
      )
    }

    // Get the appropriate amount based on whether there's a discount
    const finalAmount = hasDiscount 
      ? productConfig.discountedAmount?.[currency.toLowerCase() as keyof typeof productConfig.amount] 
      : productConfig.amount[currency.toLowerCase() as keyof typeof productConfig.amount]

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
              name: productConfig.name,
              description: hasDiscount ? `Accès à la formation en direct (Code promo : ${couponCode})` : 'Accès à la formation en direct'
            },
            unit_amount: finalAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/${productType}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${productType}?canceled=true`,
      customer_email: email,
      metadata: {
        ticketType,
        email,
        currency: currency.toLowerCase(),
        hasDiscount: hasDiscount ? 'true' : 'false',
        couponCode: couponCode || '',
        productType
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
