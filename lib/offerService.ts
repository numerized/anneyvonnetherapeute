import { getFirestore, collection, query, where, getDocs, or } from 'firebase/firestore';
import { app } from '@/lib/firebase';

export interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  userId: string;
  partnerId?: string;
  status: 'active' | 'expired' | 'used';
  createdAt: Date;
  expiresAt?: Date;
  offerName: string;
  features: string[];
}

export async function getUserOffers(userId: string, partnerId?: string): Promise<Offer[]> {
  console.log('Fetching offers for:', { userId, partnerId });
  
  const db = getFirestore(app);
  const offersRef = collection(db, 'purchases');
  
  // Create a query to fetch offers for either the user or their partner
  const conditions = [where('userId', '==', userId)];
  if (partnerId) {
    conditions.push(where('userId', '==', partnerId));
  }
  
  const offersQuery = query(offersRef, or(...conditions));
  
  try {
    const querySnapshot = await getDocs(offersQuery);
    console.log('Found offers:', querySnapshot.size);
    
    const offers = querySnapshot.docs.map(doc => {
      const data = doc.data();
      console.log('Offer data:', data);
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        expiresAt: data.expiresAt?.toDate(),
        features: data.features || []
      };
    }) as Offer[];
    
    console.log('Processed offers:', offers);
    return offers;
  } catch (error) {
    console.error('Error fetching user offers:', error);
    throw error;
  }
}
