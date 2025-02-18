import { sendEmail } from '../lib/email'
import { createLiveReminderEmailTemplate } from '../lib/emailTemplates'

async function sendTestEmail() {
  try {
    await sendEmail({
      to: 'numerized@gmail.com',
      subject: 'Le live commence dans 5 minutes ! 🎥',
      html: createLiveReminderEmailTemplate(),
    })
    console.log('Email sent successfully!')
  } catch (error) {
    console.error('Error sending email:', error)
  }
}

sendTestEmail()
