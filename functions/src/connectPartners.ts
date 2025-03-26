import { onCall } from 'firebase-functions/v2/https'
import { db, admin } from './admin'

interface ConnectPartnersData {
  invitationId: string
  inviterId: string
}

export const connectPartners = onCall<ConnectPartnersData>(
  {
    cors: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://coeur-a-corps.org',
      'https://www.coeur-a-corps.org',
    ],
  },
  async (request) => {
    // Check if the user is authenticated
    if (!request.auth) {
      throw new Error('User must be authenticated')
    }

    const { invitationId, inviterId } = request.data
    const partnerId = request.auth.uid

    try {
      // Get the invitation document
      const invitationDoc = await db
        .collection('invitations')
        .doc(invitationId)
        .get()
      if (!invitationDoc.exists) {
        throw new Error('Invitation not found')
      }

      const invitationData = invitationDoc.data()
      if (!invitationData) {
        throw new Error('Invitation data not found')
      }

      // Check if invitation is expired
      if (invitationData.expiresAt.toDate() < new Date()) {
        throw new Error('Invitation has expired')
      }

      // Check if invitation is already used
      if (invitationData.status === 'completed') {
        throw new Error('Invitation has already been used')
      }

      // Get the inviter's document
      const inviterDoc = await db.collection('users').doc(inviterId).get()
      if (!inviterDoc.exists) {
        throw new Error('Inviter not found')
      }

      const inviterData = inviterDoc.data()
      if (!inviterData) {
        throw new Error('Inviter data not found')
      }

      // Start a batch write
      const batch = db.batch()

      // Update inviter's document
      batch.update(db.collection('users').doc(inviterId), {
        partnerId: partnerId,
        partnerEmail: request.auth.token.email,
        isPartnerConnected: true,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      })

      // Update partner's document
      batch.set(
        db.collection('users').doc(partnerId),
        {
          partnerId: inviterId,
          partnerEmail: inviterData.email,
          isPartnerConnected: true,
          role: 'partner',
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      )

      // Mark invitation as completed
      batch.update(db.collection('invitations').doc(invitationId), {
        status: 'completed',
        completedAt: admin.firestore.FieldValue.serverTimestamp(),
      })

      // Commit the batch
      await batch.commit()

      return { success: true }
    } catch (error) {
      console.error('Error connecting partners:', error)
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error('Failed to connect partners')
    }
  },
)
