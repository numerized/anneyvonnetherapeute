'use server'

import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

interface PriceConfig {
  amount: {
    chf: number
    eur: number
  }
  name: string
  discountedAmount?: {
    chf: number
    eur: number
  }
}

interface TicketPrices {
  standard: {
    prochainement: PriceConfig & {
      discountedAmount: {
        chf: number
        eur: number
      }
    }
    'coaching-relationnel-en-groupe': PriceConfig & {
      discountedAmount: {
        chf: number
        eur: number
      }
    }
    webinar: PriceConfig
  }
}

// Ticket types and prices
const TICKET_PRICES: TicketPrices = {
  standard: {
    prochainement: {
      amount: {
        chf: 99900, // 999 CHF in centimes
        eur: 99900, // 999 EUR in cents
      },
      discountedAmount: {
        chf: 89900, // 899 CHF in centimes
        eur: 89900, // 899 EUR in cents
      },
      name: "Formation - Mieux vivre l'autre | Anne Yvonne Racine (coeur-a-corps.org)",
    },
    'coaching-relationnel-en-groupe': {
      amount: {
        chf: 33300, // 333 CHF in centimes
        eur: 33300, // 333 EUR in cents
      },
      discountedAmount: {
        chf: 30000, // 300 CHF in centimes
        eur: 30000, // 300 EUR in cents
      },
      name: 'Coaching Relationnel en Groupe | Anne Yvonne Racine (coeur-a-corps.org)',
    },
    webinar: {
      amount: {
        chf: 100, // 1 CHF in centimes
        eur: 100, // 1 EUR in cents
      },
      name: "Webinar - Mieux vivre l'autre | Anne Yvonne Racine (coeur-a-corps.org)",
    },
  },
}

// Test coupon code for 99% discount
const TEST_COUPON = 'TEST180YYY'

export async function POST(req: Request) {
  try {
    // Log environment variables (without exposing sensitive data)
    console.log('Environment check:', {
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      origin: req.headers.get('origin'),
    })

    const body = await req.json()
    const {
      ticketType,
      email,
      currency,
      hasDiscount,
      couponCode,
      productType = 'prochainement',
      price, // <-- get price from body
      offerTitle, // <-- get offerTitle from body
      cancelPath = '/prochainement', // <-- get cancelPath from body
    } = body
    const extraMetadata = body.metadata || {}
    console.log('Request data:', {
      ticketType,
      email,
      currency,
      hasDiscount,
      couponCode,
      productType,
      price,
      offerTitle,
      cancelPath,
    })

    const headersList = await headers()
    const origin = headersList.get('origin')
    console.log('Origin from headers:', origin)

    if (!ticketType || !email || !currency) {
      return NextResponse.json(
        { error: 'Ticket type, email, and currency are required' },
        { status: 400 },
      )
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Missing Stripe secret key')
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      //@ts-ignore
      apiVersion: '2024-12-18.acacia',
    })

    const priceData =
      TICKET_PRICES[ticketType as keyof typeof TICKET_PRICES]?.[
        productType as keyof (typeof TICKET_PRICES)['standard']
      ]
    if (!priceData) {
      return NextResponse.json(
        { error: 'Invalid ticket type or product type' },
        { status: 400 },
      )
    }

    // Get base amount first
    let baseAmount =
      priceData.amount[currency.toLowerCase() as keyof typeof priceData.amount]
    // If a price is provided from the frontend, use it (after validation)
    if (typeof price === 'number' && price > 0) {
      baseAmount = price * 100 === price ? price : Math.round(price * 100) // Accept both cents and decimal
    }

    // Calculate amount with discount if applicable
    let amount = baseAmount
    if (
      hasDiscount &&
      'discountedAmount' in priceData &&
      priceData.discountedAmount &&
      typeof price !== 'number' // Only use backend discount if frontend price not provided
    ) {
      const discountedAmount =
        priceData.discountedAmount[
          currency.toLowerCase() as keyof typeof priceData.amount
        ]
      amount = discountedAmount ?? baseAmount // Fallback to base amount if discounted amount is undefined
    }

    let finalAmount = amount
    let discountMessage = hasDiscount ? 'Discount applied' : ''

    // Apply test coupon if provided
    if (couponCode === TEST_COUPON) {
      finalAmount = 100 // 1 EUR/CHF in cents
      discountMessage = `Test discount (1 ${currency.toUpperCase()})`
    }

    // Make sure finalAmount is an integer
    finalAmount = Math.round(finalAmount)

    const session = await stripe.checkout.sessions.create({
      payment_method_types:
        currency.toLowerCase() === 'chf'
          ? ['card', 'paypal', 'twint']
          : ['card', 'paypal'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: offerTitle
                ? `${offerTitle} | Anne Yvonne Racine (coeur-a-corps.org)`
                : priceData.name,
              ...(discountMessage && { description: discountMessage }),
            },
            unit_amount: finalAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}${cancelPath}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${cancelPath}?canceled=true`,
      customer_email: email,
      metadata: {
        ticketType,
        productType,
        hasDiscount: hasDiscount ? 'true' : 'false',
        testCoupon: couponCode === TEST_COUPON ? 'true' : 'false',
        frontendPrice: price || '',
        offerTitle: offerTitle || '',
        ...extraMetadata,
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Checkout session error:', error)
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 },
    )
  }
}
