import * as sgMail from '@sendgrid/mail'
import { TherapyEmailType } from '../types/emails'
import { emailTemplates } from '../templates/emails'

export async function sendTherapyEmail(
  emailType: TherapyEmailType,
  recipientEmail: string,
  dynamicData: Record<string, any>,
): Promise<void> {
  const template = emailTemplates[emailType]
  if (!template) {
    throw new Error(`Email template not found for type: ${emailType}`)
  }

  const msg = {
    to: recipientEmail,
    from: 'contact@coeur-a-corps.org',
    subject: template.subject,
    html: template.getHtml(dynamicData),
  }

  try {
    await sgMail.send(msg)
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}
