import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import sgMail from '@sendgrid/mail'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export async function POST(req: Request) {
  const body = await req.text()
  const sig = headers().get('stripe-signature')

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      // Send confirmation email
      const isVip = session.metadata?.ticketType === 'vip'
      
      await sgMail.send({
        from: {
          email: process.env.SENDER_EMAIL!,
          name: 'Anne-Yvonne Thérapeute'
        },
        to: session.metadata?.email!,
        subject: 'Votre billet pour le Festival de la Poésie',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <img src="https://www.coeur-a-corps.org/images/logo.png" 
                 alt="Anne-Yvonne Thérapeute" 
                 style="width: 120px; height: auto; margin-bottom: 30px;"
            />
            <h2>Confirmation d'achat - Festival de la Poésie</h2>
            <p>Merci pour votre achat ! Voici les détails de votre billet :</p>
            <ul>
              <li>Type de billet : ${isVip ? 'Pack VIP' : 'Accès Standard'}</li>
              <li>Date : 15 Mars 2025</li>
              <li>Heure : 19h00 - 22h00</li>
            </ul>
            <p>Voici votre lien d'accès au festival :</p>
            <p><a href="${process.env.WHEREBY_LINK}" 
                  style="display: inline-block; padding: 12px 24px; background-color: #E76F51; color: white; text-decoration: none; border-radius: 25px;"
            >
              Accéder au festival
            </a></p>
            ${isVip ? `
            <p>En tant que membre VIP, vous aurez accès à :</p>
            <ul>
              <li>Une session Q&R exclusive avec Anne Yvonne Racine</li>
              <li>L'enregistrement de l'événement pendant 30 jours</li>
            </ul>
            ` : ''}
            <p>Conservez précieusement cet email, il contient votre lien d'accès.</p>
            <p style="color: #666; font-size: 14px; margin-top: 40px;">
              Si vous avez des questions, n'hésitez pas à nous contacter.
            </p>
          </div>
        `,
      })

      return NextResponse.json({ received: true })
    } catch (error) {
      console.error('Error processing webhook:', error)
      return NextResponse.json(
        { error: 'Webhook processing failed' },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ received: true })
}
