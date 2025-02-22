import * as sgMail from '@sendgrid/mail';
import { defineSecret } from 'firebase-functions/params';
import { TherapyEmailType } from '../types/emails';
import { emailTemplates } from '../templates/emailTemplates';

const sendgridApiKey = defineSecret('SENDGRID_API_KEY');

const baseTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body>
  ${content}
  
  --
  Anne Yvonne
  Relations
  www.coeur-a-corps.org
</body>
</html>
`;

export async function sendTherapyEmail(
  emailType: TherapyEmailType,
  recipientEmail: string,
  dynamicData: Record<string, any>
): Promise<void> {
  const template = emailTemplates[emailType];
  if (!template) {
    throw new Error(`Email template not found for type: ${emailType}`);
  }

  const msg = {
    to: recipientEmail,
    from: 'a.ra@bluewin.ch',
    subject: template.subject,
    html: template.getHtml(dynamicData)
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
