import { NextResponse } from 'next/server';
import { TherapyEmailType } from '@/functions/src/types/emails';
import { sendTestEmail } from '../emailService';

const TEST_PASSWORD = 'TEST180YYY';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { emailType, recipientEmail, password } = body;

    // Verify password
    if (password !== TEST_PASSWORD) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate email type
    const validEmailTypes = Object.values(TherapyEmailType);
    if (!validEmailTypes.includes(emailType)) {
      return NextResponse.json(
        { error: `Invalid email type. Must be one of: ${validEmailTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate recipient email
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!recipientEmail || !emailPattern.test(recipientEmail)) {
      return NextResponse.json(
        { error: 'Invalid recipient email format' },
        { status: 400 }
      );
    }

    // Create test data based on email type
    const testData = {
      name: 'Test User',
      partnerName: 'Test Partner',
      sessionDate: new Date().toISOString(),
      appointmentDate: new Date().toISOString(),
      unsubscribeUrl: 'http://example.com/unsubscribe',
      // Add specific data based on email type
      ...(emailType === TherapyEmailType.RESERVATION && {
        firstSessionDate: new Date().toISOString(),
        paymentAmount: '150 CHF',
        sessionType: 'Première séance de couple'
      }),
      ...(emailType.includes('INDIV') && {
        individualSessionDate: new Date().toISOString(),
        sessionNumber: emailType.includes('1') ? '1' : emailType.includes('2') ? '2' : '3'
      }),
      ...(emailType.includes('COUPLE') && {
        coupleSessionDate: new Date().toISOString(),
        sessionNumber: emailType.includes('1') ? '1' : emailType.includes('2') ? '2' : '3'
      })
    };

    console.log('Sending email:', {
      type: emailType,
      recipient: recipientEmail,
      data: testData
    });

    // Send the email
    await sendTestEmail(
      emailType as TherapyEmailType,
      recipientEmail,
      testData
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send email' },
      { status: 500 }
    );
  }
}
