import sgMail from '@sendgrid/mail'

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY is not set')
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

type EmailParams = {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail({
  to,
  subject,
  html,
  from = 'contact@coeur-a-corps.org',
}: EmailParams) {
  const msg = {
    to,
    from,
    subject,
    html,
  }

  try {
    await sgMail.send(msg)
  } catch (error) {
    console.error('SendGrid error:', error)
    throw error
  }
}
