import * as functions from 'firebase-functions'
import * as cors from 'cors'
import * as sgMail from '@sendgrid/mail'

const corsHandler = cors({ origin: true })

export const sendEmail = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    try {
      if (request.method !== 'POST') {
        response.status(405).json({ error: 'Method not allowed' })
        return
      }

      const { name, email, message } = request.body
      if (!name || !email || !message) {
        response.status(400).json({ error: 'Missing required fields' })
        return
      }

      const apiKey = process.env.SENDGRID_API_KEY
      if (!apiKey) {
        throw new Error('SendGrid API key not configured')
      }

      sgMail.setApiKey(apiKey)

      const msg = {
        to: process.env.RECIPIENT_EMAIL || '',
        from: process.env.SENDER_EMAIL || '',
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

      await sgMail.send(msg)
      response.status(200).json({ message: 'Email sent successfully' })
    } catch (error) {
      console.error('Error sending email:', error)
      response.status(500).json({ error: 'Failed to send email' })
    }
  })
})
