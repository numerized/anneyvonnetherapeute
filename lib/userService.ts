import { doc, getDoc, getFirestore, setDoc, updateDoc, Timestamp, serverTimestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';

// User interface
export interface User {
  id?: string;
  email: string;
  prenom?: string;
  nom?: string;
  photo?: string;
  telephone?: string;
  dateNaissance?: Date | Timestamp;  // Allow both Date and Timestamp
  role?: 'admin' | 'user' | 'partner';
  partnerId?: string;
  partnerEmail?: string;
  isPartnerConnected?: boolean;
  completedSessions?: string[];
  sessionDates?: Record<string, string>;
  sessionDetails?: Record<string, SessionDetails>;
  createdAt?: Date | Timestamp;  // Allow both Date and Timestamp
  updatedAt?: Date | Timestamp;  // Allow both Date and Timestamp
}

// Session details interface
export interface SessionDetails {
  date: string;          // ISO date string
  startTime?: string;    // Start time
  endTime?: string;      // End time
  duration?: number;     // Duration in minutes
  location?: {           // Session location (V2 API format)
    type?: string;       // Location type (physical, zoom, etc.)
    location?: string;   // Physical location details
    join_url?: string;   // URL for virtual meetings
  } | string;            // Backward compatibility with string format
  calendarEvent?: string; // Calendar event link/ID
  inviteeEmail?: string; // Email of the person who booked
  inviteeName?: string;  // Name of the person who booked
  textReminderNumber?: string; // Phone number for text reminders
  cancellationUrl?: string; // URL to cancel the appointment
  rescheduleUrl?: string; // URL to reschedule the appointment
  notes?: string;        // Any additional notes
  sessionType: string;   // Type of session
  status: 'scheduled' | 'completed' | 'cancelled';
  formattedDateTime?: string; // Formatted date and time for display
}

// Create a new user or update if exists
export async function createOrUpdateUser(userData: User): Promise<User> {
  const db = getFirestore(app);
  const userId = userData.id!;
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  // Remove id from the data to be saved
  const { id, ...dataToSave } = userData;

  // Process dates for Firestore
  const processedData = { ...dataToSave };
  
  // Convert Date objects to Firestore Timestamps
  if (processedData.dateNaissance instanceof Date) {
    processedData.dateNaissance = Timestamp.fromDate(processedData.dateNaissance);
  }

  const updatedData = {
    ...processedData,
    updatedAt: Timestamp.fromDate(new Date())
  };

  if (!userDoc.exists()) {
    // Create new user
    await setDoc(userRef, {
      ...updatedData,
      createdAt: Timestamp.fromDate(new Date())
    });
  } else {
    // Update existing user
    await updateDoc(userRef, updatedData);
  }

  // Get and return the updated user data
  const updatedDoc = await getDoc(userRef);
  const data = updatedDoc.data();
  
  // Convert Firestore Timestamps back to Date objects
  const processedUserData: any = {
    id: updatedDoc.id,
    ...data
  };
  
  // Convert timestamp fields back to Date objects
  if (data?.dateNaissance && 'toDate' in data.dateNaissance) {
    processedUserData.dateNaissance = data.dateNaissance.toDate();
  }
  
  if (data?.createdAt && 'toDate' in data.createdAt) {
    processedUserData.createdAt = data.createdAt.toDate();
  }
  
  if (data?.updatedAt && 'toDate' in data.updatedAt) {
    processedUserData.updatedAt = data.updatedAt.toDate();
  }
  
  return processedUserData as User;
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

  const data = userDoc.data();
  const processedUserData: any = {
    id: userDoc.id,
    ...data
  };
  
  // Convert timestamp fields back to Date objects
  if (data?.dateNaissance && 'toDate' in data.dateNaissance) {
    processedUserData.dateNaissance = data.dateNaissance.toDate();
  }
  
  if (data?.createdAt && 'toDate' in data.createdAt) {
    processedUserData.createdAt = data.createdAt.toDate();
  }
  
  if (data?.updatedAt && 'toDate' in data.updatedAt) {
    processedUserData.updatedAt = data.updatedAt.toDate();
  }
  
  return processedUserData as User;
}

// Get partner profile
export async function getPartnerProfile(partnerId: string): Promise<User | null> {
  return getUserById(partnerId);
}
