import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

export const addNewsletterSubscriber = functions.https.onCall(async (data, context) => {
  try {
    const { email } = data;

    if (!email || typeof email !== 'string') {
      throw new Error('Email is required and must be a string');
    }

    // Add email to newsletter collection
    await admin.firestore().collection('newsletter').add({
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true, message: 'Successfully subscribed to newsletter' };
  } catch (error) {
    console.error('Error adding newsletter subscriber:', error);
    throw new functions.https.HttpsError('internal', 'Failed to subscribe to newsletter');
  }
});
