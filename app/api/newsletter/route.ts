import { NextResponse } from 'next/server'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { app } from '@/lib/firebase'

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
      // Add to Firestore using the same collection path as the Firebase function
      const newsletterRef = collection(db, 'newsletter');
      const docRef = await addDoc(newsletterRef, {
        email,
        createdAt: serverTimestamp(), // Use serverTimestamp instead of ISO string
        source: 'website',
        status: 'active' // Add status field
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
    console.error('Error in newsletter subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
