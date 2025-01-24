import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import sgMail from '@sendgrid/mail'

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export async function POST(req: Request) {
  try {
    // Initialize Stripe inside the handler
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      //@ts-ignore
      apiVersion: '2024-12-18.acacia'
    })

    const body = await req.text()
    const sig = req.headers.get('stripe-signature')

    if (!sig) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    console.log('Webhook event received:', event.type)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      console.log('Session data:', {
        id: session.id,
        amountTotal: session.amount_total,
        metadata: session.metadata
      })

      const metadata = session.metadata as { 
        email: string; 
        ticketType: string; 
        currency: string;
        discount: string;
      } | null

      if (!metadata?.email || !metadata?.ticketType || !metadata?.currency) {
        throw new Error('Missing metadata in session')
      }

      // Get the actual amount paid from the session
      const amountTotal = session.amount_total || 0
      const finalPrice = amountTotal / 100 // Convert from cents to whole currency units
      const discountApplied = parseInt(metadata.discount || '0')

      console.log('Preparing email with:', {
        finalPrice,
        currency: metadata.currency,
        discountApplied
      })

      // Create calendar links for each date
      const eventDates = [
        { date: '2025-02-02', startTime: '19:00', endTime: '21:30' },
        { date: '2025-02-09', startTime: '19:00', endTime: '21:30' },
        { date: '2025-02-23', startTime: '19:00', endTime: '21:30' }
      ]

      const createGoogleCalendarLink = (date: string, startTime: string, endTime: string) => {
        const start = `${date}T${startTime}:00+01:00`
        const end = `${date}T${endTime}:00+01:00`
        const text = encodeURIComponent('Formation "Mieux vivre l\'autre"')
        const details = encodeURIComponent('Formation en ligne via Whereby\n\nLien de connexion: ' + process.env.WHEREBY_LINK)
        const location = encodeURIComponent('En ligne via Whereby')
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start.replace(/[-:+]/g, '')}/${end.replace(/[-:+]/g, '')}&details=${details}&location=${location}`
      }

      // Create calendar links for each date
      const calendarLinks = eventDates.map(({ date, startTime, endTime }) => ({
        date,
        googleLink: createGoogleCalendarLink(date, startTime, endTime)
      }))

      console.log('Calendar links created:', calendarLinks)

      // Send confirmation email
      const msg = {
        to: metadata.email,
        from: {
          email: 'a.ra@bluewin.ch',
          name: 'Anne-Yvonne Racine'
        },
        subject: 'Confirmation de votre inscription à la formation',
        html: `
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
                <li><strong>Montant réglé :</strong> ${finalPrice} ${metadata.currency.toUpperCase()} ${discountApplied > 0 ? `(remise de ${discountApplied}% appliquée)` : ''}</li>
              </ul>

              <h3>Ajouter les dates à votre calendrier</h3>
              <ul style="list-style: none; padding-left: 0;">
                ${calendarLinks.map(({ date, googleLink }) => `
                  <li style="margin-bottom: 10px;">
                    <strong>${new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</strong> - 
                    <a href="${googleLink}" target="_blank" style="color: #E97451; text-decoration: underline;">
                      Ajouter à Google Calendar
                    </a>
                  </li>
                `).join('')}
              </ul>

              <h3>Votre lien d'accès</h3>
              <p>Voici votre lien pour rejoindre la formation :</p>
              <p><a href="${process.env.WHEREBY_LINK}" style="color: #E97451; text-decoration: underline;">${process.env.WHEREBY_LINK}</a></p>
              
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
      }

      try {
        console.log('Attempting to send email to:', metadata.email)
        await sgMail.send(msg)
        console.log('Email sent successfully')
      } catch (error) {
        console.error('Error sending email:', error)
        // Log the full error details
        if (error.response) {
          console.error('SendGrid error details:', {
            body: error.response.body,
            statusCode: error.response.statusCode
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
