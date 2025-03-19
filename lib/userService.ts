import { doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';

// User interface
export interface User {
  id?: string;
  email: string;
  prenom?: string;
  nom?: string;
  photo?: string;
  telephone?: string;
  dateNaissance?: Date;
  role?: 'admin' | 'user' | 'partner';
  partnerId?: string;
  partnerEmail?: string;
  isPartnerConnected?: boolean;
  completedSessions?: string[];
  sessionDates?: Record<string, string>;
  sessionDetails?: Record<string, SessionDetails>;
  createdAt?: Date;
  updatedAt?: Date;
}

// Session details interface
export interface SessionDetails {
  date: string;          // ISO date string
  startTime?: string;    // Start time
  endTime?: string;      // End time
  duration?: number;     // Duration in minutes
  location?: string;     // Session location
  calendarEvent?: string; // Calendar event link/ID
  inviteeEmail?: string; // Email of the person who booked
  textReminderNumber?: string; // Phone number for text reminders
  cancellationUrl?: string; // URL to cancel the appointment
  rescheduleUrl?: string; // URL to reschedule the appointment
  notes?: string;        // Any additional notes
  sessionType: string;   // Type of session
  status: 'scheduled' | 'completed' | 'cancelled';
}

// Create a new user or update if exists
export async function createOrUpdateUser(userData: User): Promise<User> {
  const db = getFirestore(app);
  const userId = userData.id!;
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  // Remove id from the data to be saved
  const { id, ...dataToSave } = userData;

  const updatedData = {
    ...dataToSave,
    updatedAt: new Date()
  };

  if (!userDoc.exists()) {
    // Create new user
    await setDoc(userRef, {
      ...updatedData,
      createdAt: new Date()
    });
  } else {
    // Update existing user
    await updateDoc(userRef, updatedData);
  }

  // Get and return the updated user data
  const updatedDoc = await getDoc(userRef);
  return {
    id: updatedDoc.id,
    ...updatedDoc.data()
  } as User;
}

// Backward compatibility for older usage
export async function createOrUpdateUserWithFields(
  userId: string, 
  userData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<User> {
  return createOrUpdateUser({ id: userId, ...userData } as User);
}

// Get user by ID
export async function getUserById(userId: string): Promise<User | null> {
  const db = getFirestore(app);
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    return null;
  }

  return {
    id: userDoc.id,
    ...userDoc.data()
  } as User;
}

// Get partner profile
export async function getPartnerProfile(partnerId: string): Promise<User | null> {
  return getUserById(partnerId);
}
