import { NextResponse } from 'next/server'

import { sendEmail } from '@/lib/email'
import { createLiveReminderEmailTemplate } from '@/lib/emailTemplates'

export async function POST(req: Request) {
  try {
    const { emails } = await req.json()

    if (!Array.isArray(emails)) {
      return NextResponse.json(
        { error: 'Invalid request: emails must be an array' },
        { status: 400 },
      )
    }

    // Send emails in parallel
    await Promise.all(
      emails.map(async (email) => {
        await sendEmail({
          to: email,
          subject: 'Le live commence dans 5 minutes ! 🎥',
          html: createLiveReminderEmailTemplate(),
        })
      }),
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending live reminder emails:', error)
    return NextResponse.json(
      { error: 'Failed to send emails' },
      { status: 500 },
    )
  }
}
