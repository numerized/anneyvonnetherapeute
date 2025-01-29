import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import sgMail from '@sendgrid/mail'

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

// Helper function to create coaching program email template
const createCoachingEmailTemplate = (email: string, finalPrice: number, currency: string, discountApplied: number) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <img src="https://coeur-a-corps.org/images/logo.png" 
           alt="Anne-Yvonne Thérapeute" 
           style="width: 120px; height: auto; margin-bottom: 30px;"
      />
      <h2>Confirmation d'inscription - Coaching Relationnel 7/7</h2>
      <p>Merci pour votre inscription ! Voici les détails de votre programme de coaching :</p>
      
      <h3>Programme</h3>
      <p>"Coaching Relationnel 7/7 : Optimisez vos relations en 1 mois"<br/>
      par Anne-Yvonne Racine (coeur-a-corps.org)</p>

      <h3>Ce qui est inclus</h3>
      <ul style="list-style: none; padding-left: 0;">
        <li style="margin-bottom: 10px;">♦ COACHING INDIVIDUEL 24/24 SUR 1 MOIS</li>
        <li style="margin-bottom: 10px;">♦ ÉCHANGES QUOTIDIENS VIA TELEGRAM</li>
        <li style="margin-bottom: 10px;">♦ TROIS SEANCES DE THÉRAPIE À LA CARTE VIA ZOOM</li>
      </ul>

      <h3>Détails pratiques</h3>
      <ul>
        <li><strong>Durée :</strong> 1 mois d'accompagnement intensif</li>
        <li><strong>Format :</strong> Coaching individuel via Telegram et séances Zoom</li>
        <li><strong>Montant réglé :</strong> ${finalPrice} ${currency.toUpperCase()} ${
          discountApplied > 0 ? `(remise de ${discountApplied}% appliquée)` : ''
        }</li>
      </ul>

      <h3>Prochaines étapes</h3>
      <p>Je vous contacterai personnellement dans les 24 heures via l'adresse ${email} pour :</p>
      <ul>
        <li>Vous donner accès au groupe Telegram privé</li>
        <li>Planifier notre première séance de thérapie</li>
        <li>Répondre à toutes vos questions</li>
      </ul>

      <h3>Ce que vous allez développer</h3>
      <ul>
        <li>Une lucidité accrue sur vos comportements et leurs impacts</li>
        <li>Une capacité renforcée à ajuster vos réponses émotionnelles et stratégiques</li>
        <li>La création de relations en phase avec vos valeurs, vos objectifs et votre vision</li>
      </ul>

      <p>En attendant notre premier contact, je vous invite à réfléchir aux aspects de vos relations que vous souhaitez particulièrement explorer et transformer.</p>
      
      <p>Pour toute question urgente, n'hésitez pas à me contacter via coeur-a-corps.org</p>
      
      <p>Au plaisir de commencer cette transformation ensemble !</p>
      <p>Anne-Yvonne</p>
  </div>
`

// Helper function to create webinar email template (keeping the original)
const createWebinarEmailTemplate = (finalPrice: number, currency: string, discountApplied: number, calendarLinks: any[], wherebyLink: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <img src="https://coeur-a-corps.org/images/logo.png" 
           alt="Anne-Yvonne Thérapeute" 
           style="width: 120px; height: auto; margin-bottom: 30px;"
      />
      <h2>Confirmation d'inscription - Formation "Mieux vivre l'autre"</h2>
      <p>Merci pour votre inscription ! Voici les détails de votre formation :</p>
      
      <h3>Formation</h3>
      <p>"Mieux vivre l'autre : une formation pour élever la conscience relationnelle dans la diversité"<br/>
      par Anne-Yvonne Racine (coeur-a-corps.org)</p>

      <h3>Détails pratiques</h3>
      <ul>
        <li><strong>Dates :</strong> 2 + 9 + 23 février 2025 (3 soirées incluses)</li>
        <li><strong>Horaire :</strong> 19h-21h30</li>
        <li><strong>Format :</strong> Formation en ligne via Whereby (sans inscription ni installation requise)</li>
        <li><strong>Montant réglé :</strong> ${finalPrice} ${currency.toUpperCase()} ${
          discountApplied > 0 ? `(remise de ${discountApplied}% appliquée)` : ''
        }</li>
      </ul>

      <h3>Ajouter les dates à votre calendrier</h3>
      <ul style="list-style: none; padding-left: 0;">
        ${calendarLinks
          .map(
            ({ date, googleLink }) => `
          <li style="margin-bottom: 10px;">
            <strong>${new Date(date).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}</strong> - 
            <a href="${googleLink}" target="_blank" style="color: #E97451; text-decoration: underline;">
              Ajouter à Google Calendar
            </a>
          </li>
        `
          )
          .join('')}
      </ul>

      <h3>Votre lien d'accès</h3>
      <p>Voici votre lien pour rejoindre la formation :</p>
      <p><a href="${wherebyLink}" style="color: #E97451; text-decoration: underline;">${wherebyLink}</a></p>
      
      <h3>À propos de la formation</h3>
      <p>Cette formation en trois soirées vous guidera pour :</p>
      <ul>
        <li>Approfondir votre conscience de soi et valoriser votre essence unique</li>
        <li>Explorer les dimensions supérieures de la communication</li>
        <li>Tisser des liens d'âme à âme</li>
      </ul>

      <p>Pour toute question, n'hésitez pas à me contacter via coeur-a-corps.org</p>
      
      <p>Au plaisir de vous retrouver pour cette belle aventure !</p>
      <p>Anne-Yvonne</p>
  </div>
`

const stripe = new Stripe(
  process.env.NODE_ENV === 'development'
    ? process.env.STRIPE_SECRET_KEY_DEVELOPMENT!
    : process.env.STRIPE_SECRET_KEY!,
  {
    apiVersion: '2024-12-18.acacia'
  }
)

const webhookSecret = process.env.NODE_ENV === 'development'
  ? process.env.STRIPE_WEBHOOK_SECRET_DEVELOPMENT!
  : process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature!, webhookSecret)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      console.log(`❌ Error message: ${errorMessage}`)
      return NextResponse.json(
        { message: `Webhook Error: ${errorMessage}` },
        { status: 400 }
      )
    }

    console.log('✅ Success:', event.id)

    const permittedEvents: string[] = [
      'checkout.session.completed',
      'payment_intent.succeeded',
      'payment_intent.payment_failed',
    ]

    if (permittedEvents.includes(event.type)) {
      try {
        switch (event.type) {
          case 'checkout.session.completed':
            const session = event.data.object as Stripe.Checkout.Session
            console.log('Session data:', {
              id: session.id,
              amountTotal: session.amount_total,
              metadata: session.metadata
            })

            const metadata = session.metadata as {
              email: string
              ticketType: string
              currency: string
              productType: string
              hasDiscount: string
            } | null

            if (!metadata?.email || !metadata?.ticketType || !metadata?.currency) {
              throw new Error('Missing metadata in session')
            }

            const amountTotal = session.amount_total || 0
            const finalPrice = amountTotal / 100
            const hasDiscount = metadata.hasDiscount === 'true'

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
                ? createCoachingEmailTemplate(metadata.email, finalPrice, metadata.currency, hasDiscount ? 10 : 0)
                : createWebinarEmailTemplate(
                    finalPrice,
                    metadata.currency,
                    hasDiscount ? 10 : 0,
                    calendarLinks,
                    process.env.WHEREBY_LINK!
                  )

            // Send confirmation email
            const msg = {
              to: metadata.email,
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
              console.log('Attempting to send email to:', metadata.email)
              await sgMail.send(msg)
              console.log('Email sent successfully')
            } catch (error) {
              console.error('Error sending email:', error)
              if (error.response) {
                console.error('SendGrid error details:', {
                  body: error.response.body,
                  statusCode: error.response.statusCode
                })
              }
              throw error
            }
            break
          case 'payment_intent.payment_failed':
            const paymentIntent = event.data.object as Stripe.PaymentIntent
            console.log(
              `❌ Payment failed: ${paymentIntent.last_payment_error?.message}`
            )
            break
          case 'payment_intent.succeeded':
            const paymentSuccess = event.data.object as Stripe.PaymentIntent
            console.log(`💰 PaymentIntent status: ${paymentSuccess.status}`)
            break
          default:
            throw new Error(`Unhandled event: ${event.type}`)
        }
      } catch (error) {
        console.log(error)
        return NextResponse.json(
          { message: 'Webhook handler failed' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ message: 'Received' }, { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { message: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
