import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
import { TherapyEmailType, ScheduledEmail } from '../types/emails';
import { sendTherapyEmail } from '../services/emailService';

// Trigger on initial reservation
export const onReservation = onDocumentCreated(
  'couples/{coupleId}',
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      console.error('No data associated with the event');
      return;
    }
    
    const coupleData = snapshot.data();
    await sendTherapyEmail(
      TherapyEmailType.RESERVATION,
      coupleData.email,
      { 
        name: coupleData.name,
        partnerName: coupleData.partnerName,
        appointmentDate: coupleData.firstSessionDate
      }
    );
  }
);

// Handle session scheduling
export const onSessionScheduled = onDocumentCreated(
  'couples/{coupleId}/sessions/{sessionId}',
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      console.error('No data associated with the event');
      return;
    }
    
    const sessionData = snapshot.data();
    const { coupleId } = event.params;
    
    const coupleRef = admin.firestore().collection('couples').doc(coupleId);
    const coupleSnap = await coupleRef.get();
    const coupleData = coupleSnap.data();
    
    if (!coupleData) {
      console.error(`No couple data found for ID: ${coupleId}`);
      return;
    }
    
    await scheduleSessionEmails(sessionData, coupleData, coupleId);
  }
);

const scheduleSessionEmails = async (
  sessionData: any, 
  coupleData: any, 
  coupleId: string
): Promise<void> => {
  const { sessionType, sessionDate } = sessionData;
  const scheduledDate = new Date(sessionDate);
  
  const scheduledEmailsRef = admin.firestore().collection('scheduledEmails');
  
  const createScheduledEmail = async (
    emailType: TherapyEmailType,
    daysOffset: number,
    additionalData: Record<string, any> = {}
  ) => {
    const offsetDate = new Date(scheduledDate.getTime() + daysOffset * 24 * 60 * 60 * 1000);
    
    const scheduledEmail: ScheduledEmail = {
      emailType,
      recipientEmail: coupleData.email,
      scheduledFor: offsetDate,
      status: 'pending',
      coupleId,
      dynamicData: {
        name: coupleData.name,
        partnerName: coupleData.partnerName,
        sessionDate: sessionDate,
        ...additionalData
      }
    };

    await scheduledEmailsRef.add(scheduledEmail);
  };

  switch(sessionType) {
    case 'couple_1':
      // After first couple session
      await createScheduledEmail(TherapyEmailType.AFTER_COUPLE_1, 1);
      break;
      
    case 'individual_1':
      // Before and after first individual session
      await createScheduledEmail(TherapyEmailType.BEFORE_INDIV_1, -3);
      await createScheduledEmail(TherapyEmailType.AFTER_INDIV_1, 1);
      break;
      
    case 'individual_2':
      // Before and after second individual session
      await createScheduledEmail(TherapyEmailType.BEFORE_INDIV_2, -3);
      await createScheduledEmail(TherapyEmailType.AFTER_INDIV_2, 1);
      break;
      
    case 'individual_3':
      // Before third individual session
      await createScheduledEmail(TherapyEmailType.BEFORE_INDIV_3, -3);
      break;
      
    case 'couple_2':
      // Before and after second couple session
      await createScheduledEmail(TherapyEmailType.BEFORE_COUPLE_2, -5);
      await createScheduledEmail(TherapyEmailType.AFTER_COUPLE_2, 1);
      break;
  }
};
