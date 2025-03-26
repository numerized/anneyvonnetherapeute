import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json()

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 },
      )
    }

    // Initialize Stripe inside the handler
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      //@ts-ignore
      apiVersion: '2024-12-18.acacia',
    })

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error checking session:', err)
    return NextResponse.json(
      { error: 'Error checking session' },
      { status: 500 },
    )
  }
}
