import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import sgMail from '@sendgrid/mail';
import { createWebinarEmailTemplate, createCoachingEmailTemplate, createGroupCoachingEmailTemplate } from '@/lib/emailTemplates';
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from '@/lib/firebase';

// Initialize Firestore
const db = getFirestore(app);

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
    //@ts-ignore
    apiVersion: '2024-12-18.acacia'
    })
  : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  console.log('Webhook endpoint hit');
  
  if (!stripe || !webhookSecret) {
    console.error('Stripe configuration missing');
    return NextResponse.json(
      { error: 'Stripe configuration missing' },
      { status: 500 }
    );
  }

  try {
    const text = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    console.log('Webhook Headers:', {
      signature,
      contentType: headersList.get('content-type'),
    });

    if (!signature) {
      console.error('No signature found in request');
      return NextResponse.json(
        { error: 'No signature found in request' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      // Log the raw data being used for verification
      console.log('Verifying webhook with:', {
        signatureHeader: signature,
        secretLength: webhookSecret.length,
        bodyLength: text.length,
      });

      event = stripe.webhooks.constructEvent(
        text,
        signature,
        webhookSecret
      );
      console.log('Webhook event constructed:', event.type);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', {
        error: err.message,
        type: err.type,
        signature,
        secretKey: webhookSecret ? 'present' : 'missing',
      });
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      console.log('Processing completed checkout session');
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata;
      const customerEmail = session.customer_details?.email;

      console.log('Session data:', {
        id: session.id,
        customerEmail,
        metadata,
        paymentStatus: session.payment_status
      });

      if (!customerEmail || !metadata?.ticketType || !metadata?.productType) {
        console.error('Missing required session data:', { customerEmail, metadata });
        throw new Error('Missing required session data');
      }

      const amountTotal = session.amount_total || 0;
      const finalPrice = amountTotal / 100;
      const currency = session.currency?.toUpperCase() || 'EUR';
      const hasDiscount = metadata.hasDiscount === 'true';
      const isTestCoupon = metadata.testCoupon === 'true';

      // Store purchase data in Firestore
      try {
        console.log('Attempting to store purchase data in Firestore');
        const purchaseData = {
          paymentId: session.id,
          paymentIntentId: session.payment_intent,
          amount: session.amount_total,
          amountFormatted: finalPrice,
          currency: session.currency?.toUpperCase(),
          paymentStatus: session.payment_status,
          paymentMethod: session.payment_method_types?.[0],
          createdAt: new Date(session.created * 1000),
          customerEmail: customerEmail,
          customerName: session.customer_details?.name,
          customerPhone: session.customer_details?.phone,
          billingAddress: session.customer_details?.address,
          productType: metadata.productType,
          ticketType: metadata.ticketType,
          hasDiscount: hasDiscount,
          discountAmount: hasDiscount ? 10 : 0,
          isTestCoupon: isTestCoupon,
          metadata: metadata,
          environment: process.env.NODE_ENV,
          timestamp: new Date()
        };

        const docRef = await addDoc(collection(db, 'purchases'), purchaseData);
        console.log('Purchase data stored successfully in Firestore, document ID:', docRef.id);
      } catch (error) {
        console.error('Error storing purchase data:', error);
      }

      // Create calendar links for webinar
      const eventDates = [
        { date: '2025-02-02', startTime: '19:00', endTime: '21:30' },
        { date: '2025-02-09', startTime: '19:00', endTime: '21:30' },
        { date: '2025-02-23', startTime: '19:00', endTime: '21:30' }
      ];

      const createGoogleCalendarLink = (date: string, startTime: string, endTime: string) => {
        const start = `${date}T${startTime}:00+01:00`;
        const end = `${date}T${endTime}:00+01:00`;
        const text = encodeURIComponent('Formation "Mieux vivre l\'autre"');
        const details = encodeURIComponent(
          'Formation en ligne via Whereby\n\nLien de connexion: ' + process.env.WHEREBY_LINK
        );
        const location = encodeURIComponent('En ligne via Whereby');
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start.replace(
          /[-:+]/g,
          ''
        )}/${end.replace(/[-:+]/g, '')}&details=${details}&location=${location}`;
      };

      const calendarLinks = eventDates.map(({ date, startTime, endTime }) => ({
        date,
        googleLink: createGoogleCalendarLink(date, startTime, endTime)
      }));

      // Send email
      try {
        console.log('Preparing to send email for product type:', metadata.productType);
        const emailTemplate = metadata.productType === 'prochainement'
          ? createCoachingEmailTemplate(customerEmail, finalPrice, currency, isTestCoupon ? -1 : (hasDiscount ? 10 : 0))
          : metadata.productType === 'coaching-relationnel-en-groupe'
            ? createGroupCoachingEmailTemplate(customerEmail, finalPrice, currency, isTestCoupon ? -1 : (hasDiscount ? 10 : 0))
            : createWebinarEmailTemplate(
                finalPrice,
                currency,
                isTestCoupon ? -1 : (hasDiscount ? 10 : 0),
                calendarLinks,
                process.env.WHEREBY_LINK!
              );

        if (!process.env.SENDGRID_API_KEY) {
          throw new Error('SendGrid API key missing');
        }

        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        await sgMail.send({
          to: customerEmail,
          from: {
            email: 'a.ra@bluewin.ch',
            name: 'Anne Yvonne Racine'
          },
          subject: metadata.productType === 'prochainement'
            ? 'Confirmation de votre inscription au Coaching Relationnel'
            : metadata.productType === 'coaching-relationnel-en-groupe'
              ? 'Confirmation de votre inscription au Coaching Relationnel en Groupe'
              : 'Confirmation de votre inscription à la formation',
          html: emailTemplate
        });
        console.log('Confirmation email sent successfully to:', customerEmail);
      } catch (error) {
        console.error('Error sending confirmation email:', error);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}
