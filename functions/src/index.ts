import { onRequest } from 'firebase-functions/v2/https'
import { onDocumentCreated } from 'firebase-functions/v2/firestore'
import { defineSecret } from 'firebase-functions/params'
import * as sgMail from '@sendgrid/mail'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import * as crypto from 'crypto';
import { FieldValue } from 'firebase-admin/firestore';

// Initialize Firebase Admin
initializeApp()

// Define secrets
const sendgridApiKey = defineSecret('SENDGRID_API_KEY')
const recipientEmail = defineSecret('RECIPIENT_EMAIL')
const senderEmail = defineSecret('SENDER_EMAIL')
const UNSUBSCRIBE_SECRET = defineSecret('UNSUBSCRIBE_SECRET')

interface SendGridError extends Error {
  response?: {
    body: any;
  };
  code?: string;
  statusCode?: number;
}

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
function createEmailTemplate(content: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: left; margin-bottom: 30px;">
        <img src="https://anneyvonnetherapeute.vercel.app/images/logo.png" 
             alt="Anne-Yvonne Thérapeute" 
             style="width: 120px; height: auto;"
        />
      </div>
      ${content}
    </div>
  `;
}

export const sendContactEmail = onRequest(
  { 
    cors: [
      'http://localhost:3000',
      'https://anneyvonnetherapeute.vercel.app',
      'https://www.anneyvonnetherapeute.vercel.app'
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
          name: 'Anne-Yvonne Thérapie'  // This should match your verified sender name in SendGrid
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
          response: (sendGridError as SendGridError).response?.body,
          statusCode: (sendGridError as SendGridError).statusCode
        })
        throw sendGridError
      }
    } catch (error) {
      const sendGridError = error as SendGridError
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

// Newsletter subscription endpoint
export const addNewsletterSubscriber = onRequest(
  { 
    cors: [
      'http://localhost:3000',
      'https://anneyvonnetherapeute.vercel.app',
      'https://www.anneyvonnetherapeute.vercel.app'
    ]
  }, 
  async (request, response) => {
    try {
      if (request.method !== 'POST') {
        response.status(405).json({ error: 'Method not allowed' })
        return
      }

      const { email } = request.body
      console.log('Newsletter subscription request for:', email)

      if (!email) {
        response.status(400).json({ error: 'Email is required' })
        return
      }

      // Add to Firestore
      const db = getFirestore()
      await db.collection('newsletter').add({
        email,
        createdAt: new Date().toISOString(),
        source: 'website'
      })

      response.status(200).json({ message: 'Successfully subscribed to newsletter' })
    } catch (error) {
      console.error('Error in newsletter subscription:', error)
      response.status(500).json({ error: 'Failed to subscribe to newsletter' })
    }
  }
)

// Handle newsletter unsubscribe
export const handleNewsletterUnsubscribe = onRequest(
  { 
    cors: [
      'http://localhost:3000',
      'https://anneyvonnetherapeute.vercel.app',
      'https://www.anneyvonnetherapeute.vercel.app'
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
  async (event) => {
    try {
      const snapshot = event.data;
      if (!snapshot) {
        console.log('No data associated with the event');
        return;
      }

      const data = snapshot.data();
      const subscriberEmail = data.email;

      // Generate unsubscribe token
      const unsubscribeToken = generateUnsubscribeToken(subscriberEmail, UNSUBSCRIBE_SECRET.value());
      const unsubscribeUrl = `https://us-central1-coeurs-a-corps.cloudfunctions.net/handleNewsletterUnsubscribe?email=${encodeURIComponent(subscriberEmail)}&token=${unsubscribeToken}`;

      // Configure SendGrid
      sgMail.setApiKey(sendgridApiKey.value());

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
          <a href="https://anneyvonnetherapeute.vercel.app/capsules" 
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
        from: senderEmail.value(),
        subject: 'Bienvenue à nos capsules audio - Anne-Yvonne Thérapeute',
        html: createEmailTemplate(emailContent)
      };

      // Send email
      await sgMail.send(msg);
      console.log('Welcome email sent to:', subscriberEmail);

    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw new Error('Failed to send welcome email');
    }
  }
);
