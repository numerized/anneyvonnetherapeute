import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
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
  createdAt?: Date;
  updatedAt?: Date;
}

// Create a new user or update if exists
export async function createOrUpdateUser(
  userId: string, 
  userData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>
) {
  const db = getFirestore(app);
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    // Create new user
    await setDoc(userRef, {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  } else {
    // Update existing user
    await updateDoc(userRef, {
      ...userData,
      updatedAt: new Date()
    });
  }
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
