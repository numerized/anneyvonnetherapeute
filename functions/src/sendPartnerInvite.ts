import { onCall } from 'firebase-functions/v2/https'
import * as admin from 'firebase-admin'
import { defineSecret } from 'firebase-functions/params'
import sgMail from '@sendgrid/mail'
import { partnerInviteEmail } from './templates/emails/partnerInvite'
import * as crypto from 'crypto'

// Define secrets
const sendgridApiKey = defineSecret('SENDGRID_API_KEY')
const senderEmail = defineSecret('SENDER_EMAIL')

interface InviteData {
  partnerEmail: string
}

export const sendPartnerInvite = onCall<InviteData>(
  {
    cors: ['http://localhost:3000', 'https://www.coeur-a-corps.org'],
    secrets: [sendgridApiKey, senderEmail],
    region: 'europe-west1',
    timeoutSeconds: 300,
    memory: '256MiB',
  },
  async (request) => {
    // Check authentication
    if (!request.auth) {
      throw new Error(
        "L'utilisateur doit être connecté pour inviter un partenaire.",
      )
    }

    const { partnerEmail } = request.data
    if (!partnerEmail) {
      throw new Error("L'email du partenaire est requis.")
    }

    try {
      // Get the inviter's profile
      const db = admin.firestore()
      const userDoc = await db.collection('users').doc(request.auth.uid).get()
      const userData = userDoc.data()
      const inviterName = userData?.prenom || 'Votre partenaire'

      // Generate a secure invite token
      const token = crypto.randomBytes(32).toString('hex')
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now

      // Store the invitation token
      await db.collection('invitations').add({
        inviterId: request.auth.uid,
        partnerEmail,
        token,
        status: 'pending',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        expiresAt,
      })

      // Create the invite link
      const inviteLink = `${request.rawRequest.headers.origin}/invitation?token=${token}`

      // Configure SendGrid
      sgMail.setApiKey(sendgridApiKey.value())

      // Send the email
      const msg = {
        to: partnerEmail,
        from: senderEmail.value(),
        subject: `${inviterName} vous invite à le/la rejoindre sur Anne-Yvonne Thérapeute`,
        html: partnerInviteEmail(inviterName, inviteLink),
      }

      await sgMail.send(msg)

      return { success: true }
    } catch (error) {
      console.error('Error sending partner invite:', error)
      throw new Error(
        "Une erreur est survenue lors de l'envoi de l'invitation.",
      )
    }
  },
)
