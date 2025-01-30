import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import sgMail from '@sendgrid/mail'
import { createWebinarEmailTemplate, createCoachingEmailTemplate } from '@/lib/emailTemplates'

// Initialize Stripe only if we have an API key
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
    //@ts-ignore
      apiVersion: '2025-01-27.acacia'
    })
  : null

// Initialize webhook secret
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: Request) {
  // Check if Stripe is properly initialized
  if (!stripe || !webhookSecret) {
    console.error('Stripe has not been initialized')
    return NextResponse.json(
      { error: 'Stripe configuration is missing' },
      { status: 500 }
    )
  }

  try {
    const rawBody = await req.text()
    const signature = (await headers()).get('stripe-signature')

    if (!signature) {
      console.error('No signature found in request')
      return NextResponse.json(
        { error: 'No signature found in request' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      // Construct the event from the raw body
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      console.error(`❌ Webhook signature verification failed:`, errorMessage)
      console.error('Signature:', signature)
      console.error('Webhook Secret:', webhookSecret?.slice(0, 5) + '...')
      return NextResponse.json(
        { message: `Webhook Error: ${errorMessage}` },
        { status: 400 }
      )
    }

    console.log('✅ Success:', event.id)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      console.log('Session data:', {
        id: session.id,
        amountTotal: session.amount_total,
        metadata: session.metadata
      })

      const metadata = session.metadata as {
        ticketType: string
        productType: string
        hasDiscount: string
        testCoupon: string
      } | null

      if (!metadata?.ticketType || !metadata?.productType) {
        throw new Error('Missing required metadata in session')
      }

      const amountTotal = session.amount_total || 0
      const finalPrice = amountTotal / 100
      const hasDiscount = metadata.hasDiscount === 'true'
      const isTestCoupon = metadata.testCoupon === 'true'
      const customerEmail = session.customer_details?.email
      const currency = session.currency?.toUpperCase() || 'EUR'

      if (!customerEmail) {
        throw new Error('Customer email is missing from session')
      }

      // Create calendar links for webinar
      const eventDates = [
        { date: '2025-02-02', startTime: '19:00', endTime: '21:30' },
        { date: '2025-02-09', startTime: '19:00', endTime: '21:30' },
        { date: '2025-02-23', startTime: '19:00', endTime: '21:30' }
      ]

      const createGoogleCalendarLink = (date: string, startTime: string, endTime: string) => {
        const start = `${date}T${startTime}:00+01:00`
        const end = `${date}T${endTime}:00+01:00`
        const text = encodeURIComponent('Formation "Mieux vivre l\'autre"')
        const details = encodeURIComponent(
          'Formation en ligne via Whereby\n\nLien de connexion: ' + process.env.WHEREBY_LINK
        )
        const location = encodeURIComponent('En ligne via Whereby')
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start.replace(
          /[-:+]/g,
          ''
        )}/${end.replace(/[-:+]/g, '')}&details=${details}&location=${location}`
      }

      const calendarLinks = eventDates.map(({ date, startTime, endTime }) => ({
        date,
        googleLink: createGoogleCalendarLink(date, startTime, endTime)
      }))

      // Determine which email template to use based on productType
      const emailTemplate =
        metadata.productType === 'prochainement'
          ? createCoachingEmailTemplate(customerEmail, finalPrice, currency, isTestCoupon ? -1 : (hasDiscount ? 10 : 0))
          : createWebinarEmailTemplate(
              finalPrice,
              currency,
              isTestCoupon ? -1 : (hasDiscount ? 10 : 0),
              calendarLinks,
              process.env.WHEREBY_LINK!
            )

      // Initialize SendGrid
      if (!process.env.SENDGRID_API_KEY) {
        throw new Error('SendGrid API key is missing')
      }
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)

      // Send confirmation email
      const msg = {
        to: customerEmail,
        from: {
          email: 'a.ra@bluewin.ch',
          name: 'Anne-Yvonne Racine'
        },
        subject:
          metadata.productType === 'prochainement'
            ? 'Confirmation de votre inscription au Coaching Relationnel'
            : 'Confirmation de votre inscription à la formation',
        html: emailTemplate
      }

      try {
        console.log('Attempting to send email to:', customerEmail)
        await sgMail.send(msg)
        console.log('Email sent successfully')
      } catch (error) {
        console.error('Error sending email:', error)
        if ((error as any).response) {
          console.error('SendGrid error details:', {
            body: (error as any).response.body,
            statusCode: (error as any).response.statusCode
          })
        }
        throw error
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    )
  }
}
