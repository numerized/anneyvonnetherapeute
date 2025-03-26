import * as admin from 'firebase-admin'

// Initialize admin app if not already initialized
if (!admin.apps.length) {
  admin.initializeApp()
}

// Get Firestore instance
const db = admin.firestore()

export { admin, db }
