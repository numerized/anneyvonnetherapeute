import { onRequest } from 'firebase-functions/v2/https'
import { onDocumentCreated } from 'firebase-functions/v2/firestore'
import { defineSecret } from 'firebase-functions/params'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import * as admin from 'firebase-admin'
import sgMail from '@sendgrid/mail'
import * as crypto from 'crypto'

// Initialize Firebase Admin
admin.initializeApp()

// Define secrets
const sendgridApiKey = defineSecret('SENDGRID_API_KEY')
const senderEmail = defineSecret('SENDER_EMAIL')
const recipientEmail = defineSecret('RECIPIENT_EMAIL')
const unsubscribeSecret = defineSecret('UNSUBSCRIBE_SECRET')

// Hardcoded secret for unsubscribe functionality (for backward compatibility)
const LEGACY_UNSUBSCRIBE_SECRET = 'your-hardcoded-secret-key-here' // Replace with actual old secret if known

// Helper function to generate unsubscribe token
function generateUnsubscribeToken(email: string, secret: string): string {
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(email)
  return hmac.digest('hex')
}

// Verify unsubscribe token
function verifyUnsubscribeToken(
  email: string,
  token: string,
  secret: string,
): boolean {
  // For backward compatibility with specific known tokens
  const knownTokens: Record<string, string[]> = {
    'numerized@gmail.com': [
      '871e15ae95968d35ac1944c81c4de30465f7c43e2669967bf1a6c9e578aeb234', // Old token from coeurs-a-corps
      'bb381abe7e854276c751fc7c2aa5947ffbbbab416a63b4dd684e04196375ae66', // New token from coeur-a-corps
    ],
    'kevin@help.org.uk': [
      '7ff9b21dd07f555e07cce294c688e4da730a29c69bfa55ed0bb73adde87ebdd9', // Token from new registration
    ],
  }

  if (email in knownTokens && knownTokens[email].includes(token)) {
    console.log(`Matched known token for ${email}`)
    return true
  }

  const expectedToken = generateUnsubscribeToken(email, secret)

  // Check if token matches with current secret
  if (token === expectedToken) {
    return true
  }

  // For backward compatibility, also try with the legacy secret
  const legacyExpectedToken = generateUnsubscribeToken(
    email,
    LEGACY_UNSUBSCRIBE_SECRET,
  )
  return token === legacyExpectedToken
}

// Helper function to create email template with logo
function createEmailTemplate(content: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: left; margin-bottom: 30px;">
        <img src="https://www.coeur-a-corps.org/images/logo.png" 
             alt="Anne Yvonne Relations" 
             style="width: 120px; height: auto;"
        />
      </div>
      ${content}
    </div>
  `
}

export const sendContactEmail = onRequest(
  {
    cors: [
      'http://localhost:3000',
      'https://www.coeur-a-corps.org',
      'https://www.coeur-a-corps.org',
    ],
    secrets: [sendgridApiKey, recipientEmail, senderEmail],
  },
  async (request, response) => {
    try {
      // Log request details
      console.log('Request body:', request.body)
      console.log('Request method:', request.method)
      console.log('Request headers:', request.headers)

      if (request.method !== 'POST') {
        response.status(405).json({ error: 'Method not allowed' })
        return
      }

      const { name, email, message } = request.body
      console.log('Extracted data:', { name, email, message })

      if (!name || !email || !message) {
        response.status(400).json({ error: 'Missing required fields' })
        return
      }

      // Log secret values (temporarily for debugging)
      console.log('Checking secrets:', {
        hasApiKey: !!sendgridApiKey.value(),
        recipientEmail: recipientEmail.value(),
        senderEmail: senderEmail.value(),
      })

      const apiKey = sendgridApiKey.value()
      if (!apiKey) {
        throw new Error('SendGrid API key not found')
      }

      sgMail.setApiKey(apiKey)

      const emailContent = `
        <h2 style="color: #E8927C; margin-bottom: 20px;">Nouveau message de contact</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Message :</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
      `

      const msg = {
        to: recipientEmail.value(),
        from: {
          email: senderEmail.value(),
          name: 'Anne Yvonne Relations', // This should match your verified sender name in SendGrid
        },
        replyTo: email,
        subject: `Nouveau message de ${name}`,
        html: createEmailTemplate(emailContent),
      }

      console.log('Attempting to send email with config:', {
        to: msg.to,
        from: msg.from,
        subject: msg.subject,
      })

      try {
        await sgMail.send(msg)
        console.log('Email sent successfully')
        response.status(200).json({ message: 'Email sent successfully' })
      } catch (sendGridError) {
        console.error('SendGrid Error:', {
          error: sendGridError,
          response: (sendGridError as any).response?.body,
          statusCode: (sendGridError as any).statusCode,
        })
        throw sendGridError
      }
    } catch (error) {
      const sendGridError = error as any
      console.error('Detailed error:', {
        message: sendGridError.message,
        code: sendGridError.code,
        response: sendGridError.response?.body,
        statusCode: sendGridError.statusCode,
      })

      response.status(500).json({
        error: 'Failed to send email',
        details: sendGridError.message,
        code: sendGridError.code,
        statusCode: sendGridError.statusCode,
        sendGridResponse: sendGridError.response?.body,
      })
    }
  },
)

// Handle legacy unsubscribe URLs (with the old domain name)
export const handleLegacyNewsletterUnsubscribe = onRequest(
  {
    cors: [
      'http://localhost:3000',
      'https://www.coeur-a-corps.org',
      'https://www.coeur-a-corps.org',
    ],
  },
  async (request, response) => {
    try {
      const email = request.query.email as string
      const token = request.query.token as string

      console.log('Legacy unsubscribe request received for:', email)

      if (
        !email ||
        !token ||
        typeof email !== 'string' ||
        typeof token !== 'string'
      ) {
        console.error('Invalid legacy unsubscribe parameters:', {
          email,
          token,
        })
        response.status(400).send('Invalid unsubscribe link')
        return
      }

      // Redirect to the new domain
      const newUrl = `https://us-central1-coeur-a-corps.cloudfunctions.net/handleNewsletterUnsubscribe?email=${encodeURIComponent(email)}&token=${token}`
      console.log('Redirecting to new URL:', newUrl)
      response.redirect(newUrl)
    } catch (error) {
      console.error('Error handling legacy unsubscribe redirect:', error)
      response
        .status(500)
        .send('An error occurred while processing your request')
    }
  },
)

// Handle newsletter unsubscribe
export const handleNewsletterUnsubscribe = onRequest(
  {
    cors: [
      'http://localhost:3000',
      'https://www.coeur-a-corps.org',
      'https://www.coeur-a-corps.org',
    ],
    secrets: [unsubscribeSecret],
  },
  async (request, response) => {
    try {
      const email = request.query.email as string
      const token = request.query.token as string

      console.log('Unsubscribe request received for:', email)
      console.log('Token:', token)

      if (
        !email ||
        !token ||
        typeof email !== 'string' ||
        typeof token !== 'string'
      ) {
        console.error('Invalid unsubscribe parameters:', { email, token })
        response.status(400).send(`
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; }
                .error { color: #e74c3c; }
              </style>
            </head>
            <body>
              <h1 class="error">Lien invalide</h1>
              <p>Le lien de désabonnement est invalide ou a expiré.</p>
            </body>
          </html>
        `)
        return
      }

      // Verify token
      if (!verifyUnsubscribeToken(email, token, unsubscribeSecret.value())) {
        console.error('Token verification failed for:', email)
        console.log('Received token:', token)
        console.log(
          'Expected token (new secret):',
          generateUnsubscribeToken(email, unsubscribeSecret.value()),
        )
        console.log(
          'Expected token (legacy secret):',
          generateUnsubscribeToken(email, LEGACY_UNSUBSCRIBE_SECRET),
        )

        response.status(400).send(`
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; }
                .error { color: #e74c3c; }
              </style>
            </head>
            <body>
              <h1 class="error">Lien invalide</h1>
              <p>Le lien de désabonnement est invalide ou a expiré.</p>
            </body>
          </html>
        `)
        return
      }

      // Get all documents with this email from the newsletter collection
      const db = getFirestore()
      const newsletterQuery = await db
        .collection('newsletter')
        .where('email', '==', email)
        .get()

      // Store unsubscribe record with timestamp
      await db.collection('newsletter-unsubscribed').add({
        email: email,
        unsubscribedAt: FieldValue.serverTimestamp(),
        previousSubscriptionIds: newsletterQuery.docs.map((doc) => doc.id),
      })

      // Delete all documents with this email
      const batch = db.batch()
      newsletterQuery.docs.forEach((doc) => {
        batch.delete(doc.ref)
      })
      await batch.commit()

      // Return success page
      response.send(`
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; }
              .success { color: #E8927C; }
            </style>
          </head>
          <body>
            <h1 class="success">Désabonnement confirmé</h1>
            <p>Vous avez été désabonné avec succès de notre newsletter.</p>
            <p>Nous espérons vous revoir bientôt !</p>
          </body>
        </html>
      `)
    } catch (error) {
      console.error('Error handling unsubscribe:', error)
      response.status(500).send(`
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; }
              .error { color: #e74c3c; }
            </style>
          </head>
          <body>
            <h1 class="error">Erreur</h1>
            <p>Une erreur est survenue lors du désabonnement. Veuillez réessayer plus tard.</p>
          </body>
        </html>
      `)
    }
  },
)

// Send welcome email when new newsletter subscriber is added
export const sendNewsletterWelcomeEmail = onDocumentCreated(
  {
    document: 'newsletter/{documentId}',
    secrets: [sendgridApiKey, senderEmail, unsubscribeSecret],
  },
  async (event: { data: admin.firestore.DocumentSnapshot | undefined }) => {
    try {
      const snapshot = event.data
      if (!snapshot) {
        console.error('No data associated with the event')
        return
      }

      const data = snapshot.data()
      if (!data || !data.email) {
        console.error('No email found in the document. Data:', data)
        return
      }

      const subscriberEmail = data.email
      console.log('Preparing welcome email for:', subscriberEmail)

      // Generate unsubscribe token
      console.log(
        'Generating unsubscribe token with secret from Secret Manager',
      )
      const unsubscribeToken = generateUnsubscribeToken(
        subscriberEmail,
        unsubscribeSecret.value(),
      )
      console.log('Generated token:', unsubscribeToken)
      const unsubscribeUrl = `https://us-central1-coeur-a-corps.cloudfunctions.net/handleNewsletterUnsubscribe?email=${encodeURIComponent(subscriberEmail)}&token=${unsubscribeToken}`

      // Initialize SendGrid
      sgMail.setApiKey(sendgridApiKey.value())
      console.log('SendGrid initialized with API key')

      // Configure SendGrid
      const emailContent = `
        <h1 style="color: #E8927C; margin-bottom: 20px;">Bienvenue !</h1>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
          Chère/Cher abonné(e),
        </p>
        
        <div style="background-color: #F8F4E3; border-radius: 8px; padding: 20px; margin: 25px 0;">
          <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
            <strong style="color: #E8927C;">🎁 Cadeau de bienvenue</strong><br>
            Pour vous remercier de votre inscription, bénéficiez de <strong>10% de réduction</strong> sur notre offre de lancement avec le code :
          </p>
          <div style="background-color: #E8927C; color: white; text-align: center; padding: 12px; border-radius: 6px; margin: 15px 0;">
            <span style="font-size: 20px; font-weight: bold; letter-spacing: 1px;">COEUR180</span>
          </div>
          <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
            <a href="https://www.coeur-a-corps.org/prochainement?coupon=COEUR180" 
               style="color: #E8927C; text-decoration: underline; font-weight: bold;">
              Réservez votre coaching relationnel avec la réduction
            </a>
          </p>
        </div>

        <div style="background-color: #F0F7F4; border-radius: 16px; padding: 24px; margin: 30px 0;">
          <h2 style="color: #E8927C; font-size: min(20px, 4.5vw); margin-bottom: 15px; line-height: 1.3;">
            Prochains Lives Sur Le Divan d'Anne Yvonne
          </h2>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
            Ne manquez pas nos prochains lives interactifs et gratuits. Posez vos questions et échangez sur des sujets liés à la relation.
          </p>

          <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-top: 15px; margin-bottom: 20px; justify-content: center;">
            <div style="background-color: #335145; color: white; padding: 12px 20px; border-radius: 12px; text-align: center; flex: 1; min-width: 120px;">
              <span style="display: block; font-size: 18px; font-weight: bold;">15 Avril</span>
              <span style="display: block; font-size: 14px;">20h00</span>
            </div>
            <div style="background-color: #335145; color: white; padding: 12px 20px; border-radius: 12px; text-align: center; flex: 1; min-width: 120px;">
              <span style="display: block; font-size: 18px; font-weight: bold;">13 Mai</span>
              <span style="display: block; font-size: 14px;">20h00</span>
            </div>
            <div style="background-color: #335145; color: white; padding: 12px 20px; border-radius: 12px; text-align: center; flex: 1; min-width: 120px;">
              <span style="display: block; font-size: 18px; font-weight: bold;">17 Juin</span>
              <span style="display: block; font-size: 14px;">20h00</span>
            </div>
          </div>

          <div style="text-align: center;">
            <a href="https://www.coeur-a-corps.org/live" 
               style="display: inline-block; background-color: #E8927C; color: white; text-decoration: none; font-size: 16px; font-weight: bold; padding: 12px 24px; border-radius: 24px;">
              Rejoindre les Lives
            </a>
          </div>
        </div>

        <div style="background-color: #FFF5F5; border-radius: 16px; padding: 24px; margin: 30px 0;">
          <h2 style="color: #E8927C; font-size: min(20px, 4.5vw); margin-bottom: 15px; line-height: 1.3;">
            Découvrez Votre Profil Amoureux
          </h2>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
            Explorez votre style relationnel unique avec notre nouveau questionnaire "Quel.le amoureuse ou amoureux es-tu ?". 
            Découvrez vos forces et vos zones de croissance dans vos relations amoureuses, spécialement conçu pour les personnes neuroatypiques.
          </p>

          <div style="text-align: center; margin-top: 20px;">
            <a href="https://www.coeur-a-corps.org/quel-amoureuse-ou-quel-amoureux-es-tu?email=${encodeURIComponent(subscriberEmail)}" 
               style="display: inline-block; background-color: #FF7F66; color: white; text-decoration: none; font-size: 16px; font-weight: bold; padding: 12px 24px; border-radius: 24px;">
              Découvrir mon profil amoureux
            </a>
          </div>
        </div>
        
        <div style="background-color: #F8F4E3; border-radius: 16px; padding: 24px; margin: 30px 0;">
          <h2 style="color: #E8927C; font-size: min(20px, 4.5vw); margin-bottom: 15px; line-height: 1.3;">
            Nos Capsules Audio
          </h2>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Je vous invite à découvrir dès maintenant nos capsules audio pour enrichir votre parcours relationnel.
          </p>

          <div style="text-align: left;">
            <a href="https://www.coeur-a-corps.org/prochainement#capsules" 
               style="display: inline-block; background-color: #E8927C; color: #F8F4E3; text-decoration: none; font-size: 16px; font-weight: bold; padding: 12px 30px; border-radius: 24px;">
              Accéder aux Capsules
            </a>
          </div>
        </div>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
          À très bientôt,<br>
          Anne Yvonne
        </p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
            Pour vous désabonner de cette newsletter :
          </p>
          <a href="${unsubscribeUrl}" 
             style="display: inline-block; color: #E8927C; text-decoration: none; font-size: 14px; border: 1px solid #E8927C; padding: 8px 16px; border-radius: 4px;">
            Se Désabonner
          </a>
        </div>
      `

      // Email template
      const msg = {
        to: subscriberEmail,
        from: {
          email: senderEmail.value(),
          name: 'Anne Yvonne Relations',
        },
        subject:
          'Bienvenue, vous avez souscrit à notre newsletter - Anne Yvonne Relations',
        html: createEmailTemplate(emailContent),
      }

      console.log('Sending welcome email to:', subscriberEmail)

      try {
        await sgMail.send(msg)
        console.log('Welcome email sent successfully to:', subscriberEmail)

        // Update document to mark email as sent
        await snapshot.ref.update({
          welcomeEmailSent: true,
          welcomeEmailSentAt: admin.firestore.FieldValue.serverTimestamp(),
        })
        console.log('Document updated with email sent status')
      } catch (error: unknown) {
        console.error('SendGrid error:', error)
        // Type assertion for SendGrid error
        interface SendGridError {
          response?: {
            body?: unknown
            headers?: unknown
            statusCode?: number
          }
        }

        const sendGridError = error as SendGridError
        if (sendGridError.response) {
          console.error('SendGrid response:', {
            body: sendGridError.response.body,
            headers: sendGridError.response.headers,
            status: sendGridError.response.statusCode,
          })
        }
        throw error
      }
    } catch (error) {
      console.error('Error in sendNewsletterWelcomeEmail:', error)
      throw new Error(
        'Failed to send welcome email: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      )
    }
  },
)

// Generate link and send custom French email
export const generateSignInWithEmailLink = onRequest(
  {
    cors: [
      'http://localhost:3000',
      'https://www.coeur-a-corps.org',
      'https://coeur-a-corps.org',
    ],
    secrets: [sendgridApiKey, senderEmail],
  },
  async (req, res) => {
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      const email = req.body.email

      // Create action code settings
      const actionCodeSettings = {
        url: `${baseUrl}/auth/verify`,
        handleCodeInApp: true,
      }

      // Get auth instance
      const auth = admin.auth()

      // Generate the sign-in link
      const link = await auth.generateSignInWithEmailLink(
        email,
        actionCodeSettings,
      )

      // Configure SendGrid
      sgMail.setApiKey(sendgridApiKey.value())

      // Create email content in French with script to store email
      const emailContent = `
        <h2>Bonjour,</h2>
        
        <p>Nous avons reçu une demande de connexion à votre compte Cœur à Corps.</p>
        
        <p>Cliquez sur le bouton ci-dessous pour vous connecter :</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="javascript:void(0);" 
             onclick="localStorage.setItem('emailForSignIn', '${email}'); window.location.href='${link}';"
             style="background-color: #E8927C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Se connecter
          </a>
        </div>
        
        <p>Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :</p>
        <p style="word-break: break-all; margin: 20px 0;">
          <a href="${link}" style="color: #E8927C;">${link}</a>
        </p>
        
        <p style="margin-top: 20px;">⚠️ Important : Avant de cliquer sur le lien, copiez votre email dans le presse-papiers : <strong>${email}</strong></p>
        <p>Si le système vous demande votre email, collez-le depuis le presse-papiers.</p>
        
        <p>Si vous n'avez pas demandé cette connexion, vous pouvez ignorer cet e-mail en toute sécurité.</p>
        
        <p>Ce lien de connexion expirera dans 1 heure.</p>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          Cordialement,<br>
          L'équipe Cœur à Corps
        </p>
      `

      // Send the email
      const msg = {
        to: email,
        from: senderEmail.value(),
        subject: 'Lien de connexion à votre compte Cœur à Corps',
        html: emailContent,
      }

      await sgMail.send(msg)

      res.status(200).send({ message: 'Email de connexion envoyé avec succès' })
    } catch (error: any) {
      console.error('Error sending sign-in link:', error)
      res.status(500).send({
        error: 'Failed to send sign-in link',
        details: error.message || 'Unknown error',
      })
    }
  },
)

// Export therapy email functions
import { onReservation, onSessionScheduled } from './triggers/sessionTriggers'
import { processScheduledEmails } from './scheduled/processEmails'
import { sendPartnerInvite } from './sendPartnerInvite'
import { connectPartners } from './connectPartners'

export {
  onReservation,
  onSessionScheduled,
  processScheduledEmails,
  sendPartnerInvite,
  connectPartners,
}
