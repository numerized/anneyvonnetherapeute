import { NextResponse } from 'next/server'
import { getFirestore, collection, addDoc } from 'firebase/firestore'
import { app } from '@/lib/firebase'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Use the existing Firebase instance
const db = getFirestore(app);

export async function POST(request: Request) {
  try {
    // Log the incoming request
    console.log('Received newsletter subscription request');
    
    const body = await request.json();
    console.log('Request body:', body);
    
    const { email } = body;

    if (!email) {
      console.log('Email missing from request');
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Log before Firestore operation
    console.log('Adding email to newsletter collection:', email);

    try {
      // Add to Firestore
      const newsletterRef = collection(db, 'newsletter');
      const docRef = await addDoc(newsletterRef, {
        email,
        createdAt: new Date().toISOString(),
        source: 'website'
      });

      console.log('Successfully added document with ID:', docRef.id);

      return NextResponse.json(
        { message: 'Successfully subscribed to newsletter' },
        { status: 200 }
      )
    } catch (firestoreError) {
      console.error('Firestore error:', firestoreError);
      return NextResponse.json(
        { error: 'Database error: ' + (firestoreError instanceof Error ? firestoreError.message : 'Unknown error') },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('General error in newsletter subscription:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}
