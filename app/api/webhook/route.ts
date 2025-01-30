import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import sgMail from '@sendgrid/mail'
import { createWebinarEmailTemplate, createCoachingEmailTemplate } from '@/lib/emailTemplates'

// Initialize Stripe only if we have an API key
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
    //@ts-ignore
      apiVersion: '2024-12-18.acacia'
    })
  : null

// Initialize webhook secret
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: Request) {
  if (!stripe || !webhookSecret) {
    console.error('Stripe configuration missing')
    return NextResponse.json(
      { error: 'Stripe configuration missing' },
      { status: 500 }
    )
  }

  try {
    const text = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('No signature found in request')
      return NextResponse.json(
        { error: 'No signature found in request' },
        { status: 400 }
      )
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        text,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      )
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const metadata = session.metadata
      const customerEmail = session.customer_details?.email

      if (!customerEmail || !metadata?.ticketType || !metadata?.productType) {
        throw new Error('Missing required session data')
      }

      const amountTotal = session.amount_total || 0
      const finalPrice = amountTotal / 100
      const currency = session.currency?.toUpperCase() || 'EUR'
      const hasDiscount = metadata.hasDiscount === 'true'
      const isTestCoupon = metadata.testCoupon === 'true'

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

      // Select email template
      const emailTemplate = metadata.productType === 'prochainement'
        ? createCoachingEmailTemplate(customerEmail, finalPrice, currency, isTestCoupon ? -1 : (hasDiscount ? 10 : 0))
        : createWebinarEmailTemplate(
            finalPrice,
            currency,
            isTestCoupon ? -1 : (hasDiscount ? 10 : 0),
            calendarLinks,
            process.env.WHEREBY_LINK!
          )

      // Send email
      if (!process.env.SENDGRID_API_KEY) {
        throw new Error('SendGrid API key missing')
      }

      sgMail.setApiKey(process.env.SENDGRID_API_KEY)
      await sgMail.send({
        to: customerEmail,
        from: {
          email: 'a.ra@bluewin.ch',
          name: 'Anne-Yvonne Racine'
        },
        subject: metadata.productType === 'prochainement'
          ? 'Confirmation de votre inscription au Coaching Relationnel'
          : 'Confirmation de votre inscription à la formation',
        html: emailTemplate
      })
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
