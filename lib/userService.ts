import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';

// User interface
export interface User {
  id: string;
  email: string;
  prenom: string;
  nom: string;
  telephone: string;
  dateNaissance: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Create a new user or update if exists
export async function createOrUpdateUser(
  userId: string, 
  userData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<User> {
  const db = getFirestore(app);
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  
  if (userDoc.exists()) {
    // Update existing user
    const updatedData = {
      ...userData,
      updatedAt: new Date()
    };
    
    await updateDoc(userRef, updatedData);
    
    return {
      id: userId,
      ...userDoc.data(),
      ...updatedData
    } as User;
  } else {
    // Create new user
    const newUser = {
      id: userId,
      email: userData.email || '',
      prenom: userData.prenom || '',
      nom: userData.nom || '',
      telephone: userData.telephone || '',
      dateNaissance: userData.dateNaissance || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await setDoc(userRef, newUser);
    
    return newUser;
  }
}

// Get user by ID
export async function getUserById(userId: string): Promise<User | null> {
  const db = getFirestore(app);
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  
  if (userDoc.exists()) {
    return {
      id: userId,
      ...userDoc.data()
    } as User;
  }
  
  return null;
}
