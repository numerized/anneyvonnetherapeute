import { NextResponse } from 'next/server';
import { getAuth, sendSignInLinkToEmail } from 'firebase/auth';
import { app } from '@/lib/firebase';

const actionCodeSettings = {
  // URL you want to redirect back to
  url: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify`,
  // This must be true for email link sign-in
  handleCodeInApp: true,
  // Optional dynamic link domain
  dynamicLinkDomain: process.env.NEXT_PUBLIC_FIREBASE_DYNAMIC_LINKS_DOMAIN
};

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    try {
      const auth = getAuth(app);
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);

      return NextResponse.json(
        { 
          message: 'Magic link sent successfully',
          email: email
        },
        { status: 200 }
      );
    } catch (authError: any) {
      console.error('Authentication error:', authError);
      
      // Handle specific Firebase errors
      if (authError.code === 'auth/invalid-email') {
        return NextResponse.json(
          { error: 'Invalid email address' },
          { status: 400 }
        );
      }
      
      if (authError.code === 'auth/unauthorized-domain') {
        return NextResponse.json(
          { error: 'Domain not authorized. Please add it in Firebase Console.' },
          { status: 403 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to send magic link' },
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
