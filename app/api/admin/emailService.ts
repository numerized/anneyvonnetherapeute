import * as sgMail from '@sendgrid/mail';
import { TherapyEmailType } from '@/functions/src/types/emails';
import { emailTemplates } from '@/functions/src/templates/emails';

// Initialize SendGrid with your API key
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
if (!SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY is not set in environment variables');
}
sgMail.setApiKey(SENDGRID_API_KEY);

export async function sendTestEmail(
  emailType: TherapyEmailType,
  recipientEmail: string,
  testData: Record<string, any>
): Promise<void> {
  // Get the template
  const template = emailTemplates[emailType];
  if (!template) {
    throw new Error(`Email template not found for type: ${emailType}`);
  }

  // Validate sender email
  const senderEmail = process.env.SENDER_EMAIL || 'contact@coeur-a-corps.org';
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(senderEmail)) {
    throw new Error('Invalid sender email format');
  }
  if (!emailPattern.test(recipientEmail)) {
    throw new Error('Invalid recipient email format');
  }

  const msg = {
    to: recipientEmail,
    from: senderEmail,
    subject: template.subject,
    html: template.getHtml(testData)
  };

  try {
    console.log('Sending email with payload:', JSON.stringify({
      to: msg.to,
      from: msg.from,
      subject: msg.subject,
      // Don't log the full HTML to keep logs cleaner
      htmlLength: msg.html.length
    }, null, 2));
    
    await sgMail.send(msg);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
