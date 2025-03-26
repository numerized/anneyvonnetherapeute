import { onSchedule, ScheduledEvent } from 'firebase-functions/v2/scheduler'
import * as admin from 'firebase-admin'
import { sendTherapyEmail } from '../services/emailService'
import { ScheduledEmail } from '../types/emails'

export const processScheduledEmails = onSchedule(
  'every 1 hours',
  async (event: ScheduledEvent): Promise<void> => {
    const now = new Date()

    const scheduledEmailsRef = admin.firestore().collection('scheduledEmails')

    try {
      const pendingEmails = await scheduledEmailsRef
        .where('status', '==', 'pending')
        .where('scheduledFor', '<=', now)
        .limit(50) // Process in batches to avoid timeout
        .get()

      if (pendingEmails.empty) {
        console.log('No pending emails to process')
        return
      }

      const sendPromises = pendingEmails.docs.map(async (doc) => {
        const emailData = doc.data() as ScheduledEmail

        try {
          await sendTherapyEmail(
            emailData.emailType,
            emailData.recipientEmail,
            emailData.dynamicData || {},
          )

          await doc.ref.update({
            status: 'sent',
            sentAt: admin.firestore.FieldValue.serverTimestamp(),
          })

          console.log(
            `Successfully sent email ${doc.id} of type ${emailData.emailType}`,
          )
        } catch (error) {
          console.error(`Failed to send email ${doc.id}:`, error)

          await doc.ref.update({
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
            lastAttempt: admin.firestore.FieldValue.serverTimestamp(),
          })
        }
      })

      await Promise.all(sendPromises)
    } catch (error) {
      console.error('Error processing scheduled emails:', error)
      throw error
    }
  },
)
