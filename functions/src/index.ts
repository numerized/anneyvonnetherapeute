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
             alt="Anne Yvonne Thérapeute" 
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
          name: 'Anne Yvonne Thérapeute'  // This should match your verified sender name in SendGrid
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
        
        <div style="background-color: #3f6c67; border-radius: 16px; padding: 24px; margin: 30px 0;">
          <h2 style="color: #E8927C; font-size: min(24px, 4.5vw); margin-bottom: 15px; line-height: 1.3; text-align: center;">
            LE LIVE D'ANNE YVONNE SUR LE DIVAN
          </h2>
          
          <p style="color: #F8F4E3; font-size: 16px; line-height: 1.6; margin-bottom: 20px; opacity: 0.8; text-align: center;">
            Le live mensuel sur le thème du mois; ici c'est le mois DEUX, donc de l'amour à 2.
          </p>

          <p style="color: #F8F4E3; font-size: 16px; line-height: 1.6; margin-bottom: 20px; text-align: center;">
            <strong>Le 18 février à 19h</strong>
          </p>

          <div style="text-align: center;">
            <a href="https://www.coeur-a-corps.org/live" 
               style="display: inline-block; background-color: #E8927C; color: #F8F4E3; text-decoration: none; font-size: 16px; font-weight: bold; padding: 12px 30px; border-radius: 24px; margin: 0 8px;">
              Accéder au Live
            </a>
            <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Live%20d%27Anne%20Yvonne%20sur%20le%20Divan%20-%20L%27amour%20%C3%A0%202&details=Le%20live%20mensuel%20sur%20le%20th%C3%A8me%20du%20mois%3A%20l%27amour%20%C3%A0%202.%20Rejoignez-nous%20sur%20www.coeur-a-corps.org%2Flive&dates=20250218T180000Z%2F20250218T190000Z&location=www.coeur-a-corps.org%2Flive" 
               target="_blank"
               style="display: inline-block; background-color: #F8F4E3; color: #122C1C; text-decoration: none; font-size: 16px; font-weight: bold; padding: 12px 30px; border-radius: 24px; margin: 0 8px;">
              📅 Ajouter au calendrier
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
      `;

      // Email template
      const msg = {
        to: subscriberEmail,
        from: {
          email: senderEmail.value(),
          name: 'Anne Yvonne Thérapeute'
        },
        subject: 'Bienvenue, vous avez souscrit à notre newsletter - Anne Yvonne Thérapeute',
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