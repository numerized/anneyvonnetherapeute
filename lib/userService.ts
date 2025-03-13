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
): Promise<User> {
  const db = getFirestore(app);
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  const updatedData = {
    ...userData,
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
