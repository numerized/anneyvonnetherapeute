import { onRequest } from 'firebase-functions/v2/https'
import { defineSecret } from 'firebase-functions/params'
import * as sgMail from '@sendgrid/mail'

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
