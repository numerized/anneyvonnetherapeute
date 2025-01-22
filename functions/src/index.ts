import { onRequest } from 'firebase-functions/v2/https'
import { onDocumentCreated } from 'firebase-functions/v2/firestore'
import { defineSecret } from 'firebase-functions/params'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import * as admin from 'firebase-admin'
import Stripe from 'stripe'
import sgMail from '@sendgrid/mail'
import * as crypto from 'crypto'

// Initialize Firebase Admin
admin.initializeApp()

// Define secrets
const STRIPE_SECRET_KEY = defineSecret('STRIPE_SECRET_KEY')
const STRIPE_WEBHOOK_SECRET = defineSecret('STRIPE_WEBHOOK_SECRET')
const WHEREBY_LINK = defineSecret('WHEREBY_LINK')
const sendgridApiKey = defineSecret('SENDGRID_API_KEY')
const senderEmail = defineSecret('SENDER_EMAIL')
const UNSUBSCRIBE_SECRET = defineSecret('UNSUBSCRIBE_SECRET')
const recipientEmail = defineSecret('RECIPIENT_EMAIL')

// Helper function to generate unsubscribe token
function generateUnsubscribeToken(email: string, secret: string): string {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(email);
  return hmac.digest('hex');
}

// Verify unsubscribe token
function verifyUnsubscribeToken(email: string, token: string, secret: string): boolean {
  const expectedToken = generateUnsubscribeToken(email, secret);
  return token === expectedToken;
}

// Helper function to create email template with logo
function createEmailTemplate(content: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: left; margin-bottom: 30px;">
        <img src="https://www.coeur-a-corps.org/images/logo.png" 
             alt="Anne-Yvonne Thérapeute" 
             style="width: 120px; height: auto;"
        />
      </div>
      ${content}
    </div>
  `;
}

// Ticket types and prices
interface TicketPrice {
  amount: number
  name: string
}

interface TicketPrices {
  standard: TicketPrice
}

type TicketType = keyof TicketPrices

const TICKET_PRICES: TicketPrices = {
  standard: {
    amount: 11100, // 111 CHF in centimes
    name: 'Formation - Mieux vivre l\'autre | Anne-Yvonne Racine (coeur-a-corps.org)'
  }
}

interface CreateCheckoutSessionData {
  ticketType: TicketType
  email: string
}

export const sendContactEmail = onRequest(
  { 
    cors: [
      'http://localhost:3000',
      'https://www.coeur-a-corps.org',
      'https://www.coeur-a-corps.org'
    ],
    secrets: [sendgridApiKey, recipientEmail, senderEmail]
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
        senderEmail: senderEmail.value()
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
      `;

      const msg = {
        to: recipientEmail.value(),
        from: {
          email: senderEmail.value(),
          name: 'Anne-Yvonne Thérapeute'  // This should match your verified sender name in SendGrid
        },
        replyTo: email,
        subject: `Nouveau message de ${name}`,
        html: createEmailTemplate(emailContent)
      }

      console.log('Attempting to send email with config:', {
        to: msg.to,
        from: msg.from,
        subject: msg.subject
      })

      try {
        await sgMail.send(msg)
        console.log('Email sent successfully')
        response.status(200).json({ message: 'Email sent successfully' })
      } catch (sendGridError) {
        console.error('SendGrid Error:', {
          error: sendGridError,
          response: (sendGridError as any).response?.body,
          statusCode: (sendGridError as any).statusCode
        })
        throw sendGridError
      }
    } catch (error) {
      const sendGridError = error as any
      console.error('Detailed error:', {
        message: sendGridError.message,
        code: sendGridError.code,
        response: sendGridError.response?.body,
        statusCode: sendGridError.statusCode
      })

      response.status(500).json({ 
        error: 'Failed to send email',
        details: sendGridError.message,
        code: sendGridError.code,
        statusCode: sendGridError.statusCode,
        sendGridResponse: sendGridError.response?.body
      })
    }
  }
)

// Handle newsletter unsubscribe
export const handleNewsletterUnsubscribe = onRequest(
  { 
    cors: [
      'http://localhost:3000',
      'https://www.coeur-a-corps.org',
      'https://www.coeur-a-corps.org'
    ],
    secrets: [UNSUBSCRIBE_SECRET]
  }, 
  async (request, response) => {
    try {
      const email = request.query.email as string;
      const token = request.query.token as string;

      if (!email || !token || typeof email !== 'string' || typeof token !== 'string') {
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
        `);
        return;
      }

      // Verify token
      if (!verifyUnsubscribeToken(email, token, UNSUBSCRIBE_SECRET.value())) {
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
        `);
        return;
      }

      // Get all documents with this email from the newsletter collection
      const db = getFirestore();
      const newsletterQuery = await db.collection('newsletter')
        .where('email', '==', email)
        .get();

      // Store unsubscribe record with timestamp
      await db.collection('newsletter-unsubscribed').add({
        email: email,
        unsubscribedAt: FieldValue.serverTimestamp(),
        previousSubscriptionIds: newsletterQuery.docs.map(doc => doc.id)
      });

      // Delete all documents with this email
      const batch = db.batch();
      newsletterQuery.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();

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
      `);
    } catch (error) {
      console.error('Error handling unsubscribe:', error);
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
      `);
    }
  }
);

// Send welcome email when new newsletter subscriber is added
export const sendNewsletterWelcomeEmail = onDocumentCreated(
  {
    document: 'newsletter/{documentId}',
    secrets: [sendgridApiKey, senderEmail, UNSUBSCRIBE_SECRET]
  },
  async (event: { data: admin.firestore.DocumentSnapshot | undefined }) => {
    try {
      const snapshot = event.data;
      if (!snapshot) {
        console.error('No data associated with the event');
        return;
      }

      const data = snapshot.data();
      if (!data || !data.email) {
        console.error('No email found in the document. Data:', data);
        return;
      }

      const subscriberEmail = data.email;
      console.log('Preparing welcome email for:', subscriberEmail);

      // Generate unsubscribe token
      const unsubscribeToken = generateUnsubscribeToken(subscriberEmail, UNSUBSCRIBE_SECRET.value());
      const unsubscribeUrl = `https://us-central1-coeurs-a-corps.cloudfunctions.net/handleNewsletterUnsubscribe?email=${encodeURIComponent(subscriberEmail)}&token=${unsubscribeToken}`;

      // Initialize SendGrid
      sgMail.setApiKey(sendgridApiKey.value());
      console.log('SendGrid initialized with API key');

      // Configure SendGrid
      const emailContent = `
        <h1 style="color: #E8927C; margin-bottom: 20px;">Bienvenue !</h1>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
          Chère/Cher abonné(e),
        </p>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
          Je suis ravie de vous accueillir dans notre communauté. Merci d'avoir rejoint notre newsletter pour accéder à nos capsules audio.
        </p>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
          Vous recevrez régulièrement des contenus exclusifs, des méditations guidées et des exercices pratiques pour vous accompagner dans votre cheminement personnel.
        </p>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
          Je vous invite à découvrir dès maintenant nos capsules audio en cliquant sur le lien ci-dessous :
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://www.coeur-a-corps.org/capsules" 
             style="display: inline-block; background-color: #E8927C; color: white; text-decoration: none; font-size: 16px; font-weight: bold; padding: 12px 24px; border-radius: 24px;">
            Accéder aux Capsules
          </a>
        </div>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
          À très bientôt,<br>
          Anne-Yvonne
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
      `;

      // Email template
      const msg = {
        to: subscriberEmail,
        from: {
          email: senderEmail.value(),
          name: 'Anne-Yvonne Thérapeute'
        },
        subject: 'Bienvenue à nos capsules audio - Anne-Yvonne Thérapeute',
        html: createEmailTemplate(emailContent)
      };

      console.log('Sending welcome email to:', subscriberEmail);
      
      try {
        await sgMail.send(msg);
        console.log('Welcome email sent successfully to:', subscriberEmail);
        
        // Update document to mark email as sent
        await snapshot.ref.update({
          welcomeEmailSent: true,
          welcomeEmailSentAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log('Document updated with email sent status');
      } catch (error: unknown) {
        console.error('SendGrid error:', error);
        // Type assertion for SendGrid error
        interface SendGridError {
          response?: {
            body?: unknown;
            headers?: unknown;
            statusCode?: number;
          };
        }
        
        const sendGridError = error as SendGridError;
        if (sendGridError.response) {
          console.error('SendGrid response:', {
            body: sendGridError.response.body,
            headers: sendGridError.response.headers,
            status: sendGridError.response.statusCode
          });
        }
        throw error;
      }

    } catch (error) {
      console.error('Error in sendNewsletterWelcomeEmail:', error);
      throw new Error('Failed to send welcome email: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }
);

export const createCheckoutSession = onRequest(
  {
    cors: true,
    secrets: [STRIPE_SECRET_KEY],
    timeoutSeconds: 60,
    memory: '256MiB',
    minInstances: 0,
    maxInstances: 10,
  },
  async (req, res) => {
    try {
      // Initialize Stripe
      const stripe = new Stripe(STRIPE_SECRET_KEY.value(), {
        apiVersion: '2024-12-18.acacia'
      })

      const { ticketType, email } = req.body as CreateCheckoutSessionData

      if (!ticketType || !email || !(ticketType in TICKET_PRICES)) {
        res.status(400).json({ error: 'Invalid ticket type or missing email' })
        return
      }

      const ticket = TICKET_PRICES[ticketType]

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'chf',
              product_data: {
                name: ticket.name,
                description: 'Formation - Mieux vivre l\'autre'
              },
              unit_amount: ticket.amount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/prochainement?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/prochainement?canceled=true`,
        customer_email: email,
        metadata: {
          ticketType,
          email,
        },
      })

      res.json({ sessionId: session.id })
    } catch (error) {
      console.error('Error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
)

interface WebhookMetadata {
  email: string
  ticketType: TicketType
}

export const handleStripeWebhook = onRequest(
  {
    cors: true,
    secrets: [STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, WHEREBY_LINK, sendgridApiKey, senderEmail],
    timeoutSeconds: 60,
    memory: '256MiB',
    minInstances: 0,
    maxInstances: 10,
  },
  async (req, res) => {
    try {
      // Initialize Stripe
      const stripe = new Stripe(STRIPE_SECRET_KEY.value(), {
        apiVersion: '2024-12-18.acacia'
      })

      // Initialize SendGrid
      sgMail.setApiKey(sendgridApiKey.value())

      const sig = req.headers['stripe-signature']
      if (!sig || typeof sig !== 'string') {
        res.status(400).send('Missing stripe-signature header')
        return
      }

      const event = stripe.webhooks.constructEvent(
        req.rawBody!,
        sig,
        STRIPE_WEBHOOK_SECRET.value()
      )

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session
        const metadata = session.metadata as WebhookMetadata | null

        if (!metadata?.email || !metadata?.ticketType) {
          throw new Error('Missing metadata in session')
        }

        // Store ticket information in Firestore
        await getFirestore().collection('tickets').add({
          email: metadata.email,
          ticketType: metadata.ticketType,
          purchaseDate: FieldValue.serverTimestamp(),
          sessionId: session.id
        })

        // Send confirmation email
        await sgMail.send({
          from: {
            email: senderEmail.value(),
            name: 'Anne-Yvonne Thérapeute'
          },
          to: metadata.email,
          subject: 'Votre billet pour la formation',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <img src="https://www.coeur-a-corps.org/images/logo.png" 
                   alt="Anne-Yvonne Thérapeute" 
                   style="width: 120px; height: auto; margin-bottom: 30px;"
              />
              <h2>Confirmation d'achat - Formation</h2>
              <p>Merci pour votre achat ! Voici les détails de votre formation :</p>
              <ul>
                <li>Formation : Mieux vivre l'autre | Anne-Yvonne Racine (coeur-a-corps.org)</li>
                <li>Dates : 2 + 9 + 23 février 2025</li>
                <li>Horaire : 19h-21.30h</li>
                <li>Format : Whereby (sans inscriptions ni installation)</li>
              </ul>
              <p>Voici votre lien d'accès à la formation :</p>
              <p><a href="${WHEREBY_LINK.value()}" 
                    style="display: inline-block; padding: 12px 24px; background-color: #E76F51; color: white; text-decoration: none; border-radius: 25px;"
              >
                Accéder à la formation
              </a></p>
              <p>Conservez précieusement cet email, il contient votre lien d'accès.</p>
              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #666; font-size: 14px;">
                  <strong>Contact et informations :</strong><br>
                  Site web : <a href="https://coeur-a-corps.org" style="color: #E76F51;">coeur-a-corps.org</a><br>
                  Email : <a href="mailto:a.ra@bluewin.ch" style="color: #E76F51;">a.ra@bluewin.ch</a>
                </p>
              </div>
            </div>
          `,
        })
      }

      res.json({ received: true })
    } catch (err) {
      if (err instanceof Error) {
        res.status(400).send(`Webhook Error: ${err.message}`)
      } else {
        res.status(400).send('Webhook Error: Unknown error occurred')
      }
    }
  }
)

// Verify ticket access
export const verifyTicketAccess = onRequest(
  { 
    cors: [
      'http://localhost:3000',
      'https://www.coeur-a-corps.org'
    ],
    secrets: [WHEREBY_LINK]
  },
  async (req, res) => {
    try {
      const { email } = req.body

      if (!email) {
        res.status(400).json({ error: 'Email is required' })
        return
      }

      const db = getFirestore()
      const ticketSnapshot = await db.collection('tickets')
        .where('email', '==', email)
        .where('used', '==', false)
        .get()

      if (ticketSnapshot.empty) {
        res.status(404).json({ error: 'No valid ticket found' })
        return
      }

      // Return access link
      res.json({ accessLink: WHEREBY_LINK.value() })
    } catch (error) {
      console.error('Error verifying ticket:', error)
      res.status(500).json({ error: 'Failed to verify ticket' })
    }
  }
)
