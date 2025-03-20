import { app } from '@/lib/firebase';
import { 
  collection, 
  deleteField, 
  doc, 
  getDoc, 
  getDocs, 
  getFirestore, 
  query, 
  serverTimestamp, 
  setDoc, 
  Timestamp, 
  updateDoc, 
  where
} from 'firebase/firestore';

// User interface
export interface User {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  photo?: string | null; 
  phone?: string;
  birthDate?: Date | Timestamp;
  role?: 'admin' | 'user' | 'partner';
  partnerId?: string;
  partnerEmail?: string;
  isPartnerConnected?: boolean;
  completedSessions?: string[];
  sessionDates?: Record<string, string>;
  sessionDetails?: Record<string, SessionDetails>;
  createdAt?: Date | Timestamp;
  updatedAt?: Date | Timestamp;
}

// UserProfile interface (compatible with UserProfileSection component)
export interface UserProfile {
  id?: string;
  uid?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  photo?: string | null;
  phone?: string;
  birthDate?: Date | Timestamp;
  role?: 'admin' | 'user' | 'partner';
  partnerId?: string;
  partnerEmail?: string;
  isPartnerConnected?: boolean;
  completedSessions?: string[];
  sessionDates?: Record<string, string>;
  sessionDetails?: Record<string, SessionDetails>;
  createdAt?: Date | Timestamp;
  updatedAt?: Date | Timestamp;
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
  eventUri?: string;     // Calendly event URI
  formattedDate?: string; // Formatted date string for display
  lastUpdated?: Date | Timestamp; // Last update timestamp
  cancelUrl?: string;    // URL to cancel the appointment
  sessionType: string;   // Type of session
  status: 'scheduled' | 'completed' | 'cancelled';
  formattedDateTime?: string; // Formatted date and time for display
  notes?: string;        // Any additional notes
}

// Create a new user or update if exists
export async function createOrUpdateUser(userData: User): Promise<User> {
  const db = getFirestore(app);
  const userId = userData.id!;
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  // Remove id from the data to be saved
  const { id, ...dataToSave } = userData;

  // Process dates for Firestore and remove undefined values
  const processedData: Record<string, any> = {};
  
  // Only include defined values
  Object.entries(dataToSave).forEach(([key, value]) => {
    if (value !== undefined) {
      if (key === 'birthDate' && value instanceof Date) {
        processedData[key] = Timestamp.fromDate(value);
      } else if (key === 'photo' && value === null) {
        // Explicitly set photo to null to delete it
        processedData[key] = null;
      } else if (value !== null) {
        processedData[key] = value;
      }
    }
  });

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
  if (data?.birthDate && 'toDate' in data.birthDate) {
    processedUserData.birthDate = data.birthDate.toDate();
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
  if (data?.birthDate && 'toDate' in data.birthDate) {
    processedUserData.birthDate = data.birthDate.toDate();
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

// Function to migrate user data to use English property names
export async function migrateUserToEnglishProperties(userId: string): Promise<void> {
  const db = getFirestore(app);
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    return;
  }

  const data = userDoc.data();
  const updates: Record<string, any> = {};
  let needsUpdate = false;

  // Check and migrate each French property to English
  if ('prenom' in data) {
    updates.firstName = data.prenom;
    needsUpdate = true;
  }

  if ('nom' in data) {
    updates.lastName = data.nom;
    needsUpdate = true;
  }

  if ('telephone' in data) {
    updates.phone = data.telephone;
    needsUpdate = true;
  }

  if ('dateNaissance' in data) {
    updates.birthDate = data.dateNaissance;
    needsUpdate = true;
  }

  // Only update if there are properties to migrate
  if (needsUpdate) {
    // Remove old properties
    const removeFields: Record<string, any> = {
      prenom: deleteField(),
      nom: deleteField(),
      telephone: deleteField(),
      dateNaissance: deleteField()
    };

    // First update with new properties
    await updateDoc(userRef, {
      ...updates,
      updatedAt: Timestamp.fromDate(new Date())
    });

    // Then remove old properties
    await updateDoc(userRef, removeFields);
  }
}

// Function to migrate all users to English properties
export async function migrateAllUsersToEnglish(): Promise<void> {
  const db = getFirestore(app);
  const usersCollection = collection(db, 'users');
  const usersSnapshot = await getDocs(usersCollection);

  const migrations = usersSnapshot.docs.map(doc => migrateUserToEnglishProperties(doc.id));
  await Promise.all(migrations);
}
