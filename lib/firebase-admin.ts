import { cert,getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Initialize Firebase Admin
const apps = getApps()

if (!apps.length) {
  try {
    // Log raw environment variables for debugging
    console.log('Raw environment variables check:', {
      projectId: typeof process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: typeof process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
      privateKey: typeof process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY,
      // Log first few chars if they exist
      projectIdValue: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmailPreview: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL
        ? `${process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL.substring(0, 10)}...`
        : null,
      privateKeyPreview: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY
        ? `${process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY.substring(0, 20)}...`
        : null,
    })

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    const clientEmail = process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL
    let privateKey = process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(`Missing required Firebase credentials:
        - Project ID: ${!!projectId}
        - Client Email: ${!!clientEmail}
        - Private Key: ${!!privateKey}`)
    }

    // Ensure private key is properly formatted
    if (privateKey && !privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
      console.warn(
        'Private key is missing BEGIN marker, attempting to fix format...',
      )
      privateKey = `-----BEGIN PRIVATE KEY-----\n${privateKey}\n-----END PRIVATE KEY-----`
    }

    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.includes('\\n')
          ? privateKey.replace(/\\n/g, '\n')
          : privateKey,
      }),
    })

    console.log('Firebase Admin initialized successfully')
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error)
    throw error
  }
}

// Only initialize Firestore if Firebase Admin was initialized successfully
let adminDb
try {
  adminDb = getFirestore()
  console.log('Firestore Admin initialized successfully')
} catch (error) {
  console.error('Error initializing Firestore:', error)
  throw error
}

export { adminDb }
