import { onRequest } from 'firebase-functions/v2/https'
import { onDocumentCreated } from 'firebase-functions/v2/firestore'
import { defineSecret } from 'firebase-functions/params'
import * as sgMail from '@sendgrid/mail'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Initialize Firebase Admin
initializeApp()

// Define secrets
const sendgridApiKey = defineSecret('SENDGRID_API_KEY')
const recipientEmail = defineSecret('RECIPIENT_EMAIL')
const senderEmail = defineSecret('SENDER_EMAIL')

interface SendGridError extends Error {
  response?: {
    body: any;
  };
  code?: string;
  statusCode?: number;
}

export const sendContactEmail = onRequest(
  { 
    cors: [
      'http://localhost:3000',
      'https://anneyvonne.fr',
      'https://www.anneyvonne.fr'
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

      const msg = {
        to: recipientEmail.value(),
        from: {
          email: senderEmail.value(),
          name: 'Anne-Yvonne Thérapie'  // This should match your verified sender name in SendGrid
        },
        subject: `Nouveau message de ${name}`,
        text: `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `
          <h3>Nouveau message du site web</h3>
          <p><strong>Nom:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `
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
      'https://anneyvonne.fr',
      'https://www.anneyvonne.fr'
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

// Send welcome email when new newsletter subscriber is added
export const sendNewsletterWelcomeEmail = onDocumentCreated(
  {
    document: 'newsletter/{documentId}',
    secrets: [sendgridApiKey, senderEmail]
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

      // Configure SendGrid
      sgMail.setApiKey(sendgridApiKey.value());

      // Email template
      const msg = {
        to: subscriberEmail,
        from: senderEmail.value(),
        subject: 'Bienvenue à nos capsules audio - Anne-Yvonne Thérapeute',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
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
              N'hésitez pas à explorer nos capsules audio déjà disponibles sur notre site.
            </p>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
              À très bientôt,<br>
              Anne-Yvonne
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666;">
              <p>
                Si vous souhaitez vous désabonner, répondez simplement à cet email.
              </p>
            </div>
          </div>
        `
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
