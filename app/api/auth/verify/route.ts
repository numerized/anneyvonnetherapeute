import { NextResponse } from 'next/server';
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { app } from '@/lib/firebase';

export async function POST(request: Request) {
  try {
    const { email, link } = await request.json();

    if (!email || !link) {
      return NextResponse.json(
        { error: 'Email and link are required' },
        { status: 400 }
      );
    }

    const auth = getAuth(app);

    // Verify if the link is a valid sign-in link
    if (!isSignInWithEmailLink(auth, link)) {
      return NextResponse.json(
        { error: 'Invalid sign-in link' },
        { status: 400 }
      );
    }

    try {
      // Complete the sign-in process
      const userCredential = await signInWithEmailLink(auth, email, link);
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      // Set the session cookie
      const response = NextResponse.json({
        message: 'Successfully signed in',
        user: {
          uid: user.uid,
          email: user.email,
        }
      });

      return response;
    } catch (signInError: any) {
      console.error('Sign-in error:', signInError);
      
      if (signInError.code === 'auth/invalid-email') {
        return NextResponse.json(
          { error: 'Invalid email address' },
          { status: 400 }
        );
      }

      if (signInError.code === 'auth/expired-action-code') {
        return NextResponse.json(
          { error: 'Link has expired. Please request a new one.' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to complete sign-in' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('General error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
