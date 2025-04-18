import sgMail from '@sendgrid/mail'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

import {
  createCoachingEmailTemplate,
  createGroupCoachingEmailTemplate,
  createWebinarEmailTemplate,
} from '@/lib/emailTemplates'
import { adminDb } from '@/lib/firebase-admin'

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      //@ts-ignore
      apiVersion: '2024-12-18.acacia',
    })
  : null

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: Request) {
  console.log('Webhook endpoint hit')

  if (!stripe || !webhookSecret) {
    console.error('Stripe configuration missing')
    return NextResponse.json(
      { error: 'Stripe configuration missing' },
      { status: 500 },
    )
  }

  try {
    const text = await req.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      console.error('No signature found in request')
      return NextResponse.json(
        { error: 'No signature found in request' },
        { status: 400 },
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(text, signature, webhookSecret)
      console.log('Webhook event constructed:', event.type)
    } catch (err: any) {
      console.error(
        'Webhook signature verification failed - see details below:',
      )
      console.error(
        err
          ? `Error message: ${err.message || 'Unknown error'}`
          : 'No error details available (null)',
      )
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 },
      )
    }

    if (event.type === 'checkout.session.completed') {
      console.log('Processing completed checkout session')
      const session = event.data.object as Stripe.Checkout.Session
      const metadata = session.metadata
      const customerEmail = session.customer_details?.email

      console.log('Session data:', {
        id: session.id,
        customerEmail,
        metadata,
        paymentStatus: session.payment_status,
      })

      if (!customerEmail || !metadata?.ticketType || !metadata?.productType) {
        console.error('Missing required session data:', {
          customerEmail,
          metadata,
        })
        throw new Error('Missing required session data')
      }

      const amountTotal = session.amount_total || 0
      const finalPrice = amountTotal / 100
      const currency = session.currency?.toUpperCase() || 'EUR'
      const hasDiscount = metadata.hasDiscount === 'true'
      const isTestCoupon = metadata.testCoupon === 'true'

      // Create calendar links for webinar first (needed for email)
      const eventDates = [
        { date: '2025-02-02', startTime: '19:00', endTime: '21:30' },
        { date: '2025-02-09', startTime: '19:00', endTime: '21:30' },
        { date: '2025-02-23', startTime: '19:00', endTime: '21:30' },
      ]

      const createGoogleCalendarLink = (
        date: string,
        startTime: string,
        endTime: string,
      ) => {
        const start = `${date}T${startTime}:00+01:00`
        const end = `${date}T${endTime}:00+01:00`
        const text = encodeURIComponent('Formation "Mieux vivre l\'autre"')
        const details = encodeURIComponent(
          'Formation en ligne via Whereby\n\nLien de connexion: ' +
            process.env.WHEREBY_LINK,
        )
        const location = encodeURIComponent('En ligne via Whereby')
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start.replace(
          /[-:+]/g,
          '',
        )}/${end.replace(/[-:+]/g, '')}&details=${details}&location=${location}`
      }

      const calendarLinks = eventDates.map(({ date, startTime, endTime }) => ({
        date,
        googleLink: createGoogleCalendarLink(date, startTime, endTime),
      }))

      // Send confirmation email first, before any Firebase operations
      try {
        console.log('Preparing to send confirmation email...')
        let emailTemplate = ''

        if (metadata.productType === 'prochainement') {
          // Build offer details for email
          const offerTitle = metadata.offerTitle || 'Votre offre'
          let offerDetailsHtml = ''
          if (metadata.formulas) {
            try {
              const formulas = JSON.parse(metadata.formulas)
              if (Array.isArray(formulas) && formulas.length > 0) {
                offerDetailsHtml += "<h3>Détails de l'offre choisie :</h3><ul>"
                for (const formula of formulas) {
                  offerDetailsHtml += `<li><strong>${formula.title}</strong> - ${formula.duration} : ${formula.price} ${currency} (${formula.priceDetails || ''})</li>`
                }
                offerDetailsHtml += '</ul>'
              }
            } catch (e) {
              // fallback: show as text
              offerDetailsHtml += `<p>${metadata.formulas}</p>`
            }
          }
          if (metadata.priceDetails) {
            offerDetailsHtml += `<p><strong>Détails du prix :</strong> ${metadata.priceDetails}</p>`
          }
          if (metadata.sessionLength) {
            offerDetailsHtml += `<p><strong>Durée de la séance :</strong> ${metadata.sessionLength}</p>`
          }

          // Compose custom email template
          emailTemplate = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <img src="https://coeur-a-corps.org/images/logo.png" 
                   alt="Anne Yvonne Relations" 
                   style="width: 120px; height: auto; margin-bottom: 30px;"
              />
              <h2 style="color: #E8927C;">Confirmation d'inscription - ${offerTitle}</h2>
              <p>Merci pour votre achat ! Voici les détails de votre offre :</p>
              <ul>
                <li><strong>Offre :</strong> ${offerTitle}</li>
                <li><strong>Montant réglé :</strong> ${finalPrice} ${currency} ${hasDiscount ? '(remise appliquée)' : ''}</li>
              </ul>
              ${offerDetailsHtml}
              <h3>Prochaines étapes</h3>
              <p>Je vous contacterai personnellement dans les 24 heures via l'adresse ${customerEmail} pour organiser la suite de votre accompagnement.</p>
              <p>Pour toute question urgente, n'hésitez pas à me contacter via a.ra@bluewin.ch</p>
              <p>Au plaisir de commencer cette transformation ensemble !</p>
              <p>Anne Yvonne</p>
  
              <div style="background: #faf6e6; border-radius: 28px; padding: 28px 24px 24px 24px; margin: 24px 0 32px 0;">
                <p style="color: #E8927C; font-size: 1.35rem; font-weight: bold; margin-bottom: 12px; font-family: Arial, sans-serif;">Nos Capsules Audio</p>
                <p style="color: #333; font-size: 1.1rem; margin-bottom: 22px; font-family: Arial, sans-serif;">Je vous invite à découvrir dès maintenant nos capsules audio pour enrichir votre parcours relationnel.</p>
                <a href="https://www.coeur-a-corps.org/espace180" target="_blank" style="display: inline-block; background: #E8927C; color: #fff; font-weight: bold; font-size: 1.35rem; border-radius: 40px; padding: 18px 38px; text-decoration: none; text-align: center; font-family: Arial, sans-serif;">Accéder aux Capsules</a>
              </div>
            </div>
          `
        } else if (metadata.productType === 'coaching-relationnel-en-groupe') {
          emailTemplate = createGroupCoachingEmailTemplate(
            customerEmail,
            finalPrice,
            currency,
            isTestCoupon ? -1 : hasDiscount ? 10 : 0,
          )
          emailTemplate += `

            <div style="background: #faf6e6; border-radius: 28px; padding: 28px 24px 24px 24px; margin: 24px 0 32px 0;">
              <p style="color: #E8927C; font-size: 1.35rem; font-weight: bold; margin-bottom: 12px; font-family: Arial, sans-serif;">Nos Capsules Audio</p>
              <p style="color: #333; font-size: 1.1rem; margin-bottom: 22px; font-family: Arial, sans-serif;">Je vous invite à découvrir dès maintenant nos capsules audio pour enrichir votre parcours relationnel.</p>
              <a href="https://www.coeur-a-corps.org/espace180" target="_blank" style="display: inline-block; background: #E8927C; color: #fff; font-weight: bold; font-size: 1.35rem; border-radius: 40px; padding: 18px 38px; text-decoration: none; text-align: center; font-family: Arial, sans-serif;">Accéder aux Capsules</a>
            </div>
          `
        } else {
          emailTemplate = createWebinarEmailTemplate(
            finalPrice,
            currency,
            isTestCoupon ? -1 : hasDiscount ? 10 : 0,
            calendarLinks,
            process.env.WHEREBY_LINK!,
          )
          emailTemplate += `

            <div style="background: #faf6e6; border-radius: 28px; padding: 28px 24px 24px 24px; margin: 24px 0 32px 0;">
              <p style="color: #E8927C; font-size: 1.35rem; font-weight: bold; margin-bottom: 12px; font-family: Arial, sans-serif;">Nos Capsules Audio</p>
              <p style="color: #333; font-size: 1.1rem; margin-bottom: 22px; font-family: Arial, sans-serif;">Je vous invite à découvrir dès maintenant nos capsules audio pour enrichir votre parcours relationnel.</p>
              <a href="https://www.coeur-a-corps.org/espace180" target="_blank" style="display: inline-block; background: #E8927C; color: #fff; font-weight: bold; font-size: 1.35rem; border-radius: 40px; padding: 18px 38px; text-decoration: none; text-align: center; font-family: Arial, sans-serif;">Accéder aux Capsules</a>
            </div>
          `
        }

        if (!process.env.SENDGRID_API_KEY) {
          throw new Error('SendGrid API key missing')
        }

        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        await sgMail.send({
          to: customerEmail,
          from: {
            email: 'a.ra@bluewin.ch',
            name: 'Anne Yvonne Racine',
          },
          subject:
            metadata.productType === 'prochainement'
              ? `Confirmation de votre inscription - ${metadata.offerTitle || 'Votre offre'}`
              : metadata.productType === 'coaching-relationnel-en-groupe'
                ? 'Confirmation de votre inscription au Coaching Relationnel en Groupe'
                : 'Confirmation de votre inscription à la formation',
          html: emailTemplate,
        })
        console.log('Confirmation email sent successfully to:', customerEmail)
      } catch (error) {
        console.error('Error sending confirmation email - see details below:')
        console.error(
          error
            ? `Error message: ${error.message || 'Unknown error'}`
            : 'No error details available (null)',
        )
        throw error // Important to notify if email fails
      }

      // After email is sent, try Firebase operations
      try {
        console.log('Starting Firebase operations...')

        // Find or create user by email
        let userId: string | null = null
        try {
          console.log('Looking for user with email:', customerEmail)
          const usersRef = adminDb.collection('users')
          const q = usersRef.where('email', '==', customerEmail)
          const querySnapshot = await q.get()

          if (!querySnapshot.empty) {
            userId = querySnapshot.docs[0].id
            console.log(
              '✅ Found existing user with ID:',
              userId,
              'for email:',
              customerEmail,
            )
          } else {
            console.log(
              '❌ No user found with email:',
              customerEmail,
              '. Creating new user...',
            )
            // Create a new user document
            const userPayload = {
              email: customerEmail,
              name: session.customer_details?.name || '',
              phone: session.customer_details?.phone || '',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
            if (!userPayload.email) {
              console.error('Cannot create user: missing email', userPayload)
            } else {
              const newUserDoc = await adminDb
                .collection('users')
                .add(userPayload)
              userId = newUserDoc.id
              console.log(
                '🆕 Created new user with ID:',
                userId,
                'for email:',
                customerEmail,
              )
            }
          }
        } catch (error) {
          console.error('Error finding/creating user - see details below:')
          console.error(
            error
              ? `Error message: ${error.message || 'Unknown error'}`
              : 'No error details available (null)',
          )
          // Continue with purchase data, even if user operations fail
        }

        // Store purchase data in Firestore
        try {
          console.log('Attempting to store purchase data in Firestore')
          const purchaseData = {
            // Payment Information
            paymentId: session.id,
            paymentIntentId: session.payment_intent,
            amount: session.amount_total,
            amountFormatted: finalPrice,
            currency: session.currency?.toUpperCase(),
            paymentStatus: session.payment_status,
            paymentMethod: session.payment_method_types?.[0],
            createdAt: new Date(session.created * 1000),

            // Customer Information
            customerEmail: customerEmail,
            customerName: session.customer_details?.name,
            customerPhone: session.customer_details?.phone,
            billingAddress: session.customer_details?.address,
            userId: userId, // Add userId if found

            // Product Information
            productType: metadata.productType,
            ticketType: metadata.ticketType,

            // Discount Information
            hasDiscount: hasDiscount,
            discountAmount: hasDiscount ? 10 : 0,
            isTestCoupon: isTestCoupon,

            // Additional Metadata
            metadata: metadata,

            // System Information
            environment: process.env.NODE_ENV,
            timestamp: new Date(),
          }

          // Defensive check: Make sure purchaseData is a valid object
          if (!purchaseData || typeof purchaseData !== 'object') {
            console.error('Invalid purchaseData for Firestore:', purchaseData)
          } else {
            const docRef = await adminDb
              .collection('purchases')
              .add(purchaseData)
            console.log(
              'Purchase data stored successfully in Firestore, document ID:',
              docRef.id,
            )
          }
        } catch (error) {
          console.error('Error storing purchase data - see details below:')
          console.error(
            error
              ? `Error message: ${error.message || 'Unknown error'}`
              : 'No error details available (null)',
          )
          // Don't throw here, as we've already sent the email
        }
      } catch (error) {
        console.error('Error with Firebase operations - see details below:')
        console.error(
          error
            ? `Error message: ${error.message || 'Unknown error'}`
            : 'No error details available (null)',
        )
        // Don't throw here, as we've already sent the email
      }

      return NextResponse.json({ received: true })
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook error - see details below:')
    console.error(
      err
        ? `Error message: ${err.message || 'Unknown error'}`
        : 'No error details available (null)',
    )
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 },
    )
  }
}
