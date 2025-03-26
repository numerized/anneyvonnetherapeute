import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from 'firebase/auth'
import { NextResponse } from 'next/server'

import { app } from '@/lib/firebase'

export async function POST(request: Request) {
  try {
    const { email, link } = await request.json()
    console.log('Verify endpoint received:', { email, link })

    if (!email || !link) {
      console.log('Missing email or link')
      return NextResponse.json(
        { error: 'Email and link are required' },
        { status: 400 },
      )
    }

    const auth = getAuth(app)

    // Verify if the link is a valid sign-in link
    try {
      const isValid = isSignInWithEmailLink(auth, link)
      console.log('Is link valid?', isValid)

      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid sign-in link' },
          { status: 400 },
        )
      }
    } catch (validationError) {
      console.error('Link validation error:', validationError)
      return NextResponse.json(
        { error: 'Failed to validate sign-in link' },
        { status: 400 },
      )
    }

    try {
      console.log('Attempting to sign in with email link...')
      // Complete the sign-in process
      const userCredential = await signInWithEmailLink(auth, email, link)
      console.log('Sign in successful:', userCredential.user.email)

      const user = userCredential.user
      const idToken = await user.getIdToken()
      console.log('Got ID token')

      return NextResponse.json({
        message: 'Successfully signed in',
        user: {
          uid: user.uid,
          email: user.email,
        },
      })
    } catch (signInError: any) {
      console.error('Detailed sign-in error:', {
        code: signInError.code,
        message: signInError.message,
        stack: signInError.stack,
      })

      if (signInError.code === 'auth/invalid-email') {
        return NextResponse.json(
          { error: 'Invalid email address' },
          { status: 400 },
        )
      }

      if (signInError.code === 'auth/expired-action-code') {
        return NextResponse.json(
          { error: 'Link has expired. Please request a new one.' },
          { status: 400 },
        )
      }

      return NextResponse.json(
        { error: signInError.message || 'Failed to complete sign-in' },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error('General error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 },
    )
  }
}
