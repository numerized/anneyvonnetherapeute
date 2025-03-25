import { app } from '@/lib/firebase';
import { collection, getDocs, getFirestore, query, where, Timestamp } from 'firebase/firestore';
import { User } from './userService';
import { Offer } from './offerService';

interface UserWithOffer extends User {
  currentOffer?: Offer | null;
}

export async function getAllUsers(): Promise<UserWithOffer[]> {
  const db = getFirestore(app);
  const usersRef = collection(db, 'users');
  
  // First get all users to check what we have
  const allUsersSnapshot = await getDocs(collection(db, 'users'));
  console.log('Total users in collection:', allUsersSnapshot.size);
  allUsersSnapshot.forEach(doc => {
    console.log('User data:', doc.id, doc.data());
  });

  // Get all users without filtering first
  const usersSnapshot = await getDocs(usersRef);
  console.log('All users:', usersSnapshot.size);
  
  const users: UserWithOffer[] = [];
  
  for (const userDoc of usersSnapshot.docs) {
    const userData = userDoc.data() as User;
    console.log('Processing user:', userData.email, 'isTherapist:', userData.isTherapist);
    
    // Skip therapists
    if (userData.isTherapist === true) {
      console.log('Skipping therapist:', userData.email);
      continue;
    }

    // Get partner's session dates if partner exists
    let partnerProfile = userData.partnerProfile;
    if (partnerProfile && partnerProfile.email) {
      const partnerQuery = query(usersRef, where('email', '==', partnerProfile.email));
      const partnerSnapshot = await getDocs(partnerQuery);
      if (!partnerSnapshot.empty) {
        const partnerData = partnerSnapshot.docs[0].data();
        partnerProfile = {
          ...partnerProfile,
          sessionDates: partnerData.sessionDates
        };
      }
    }
    
    // Get user's latest offer
    const purchasesRef = collection(db, 'purchases');
    const purchasesQuery = query(purchasesRef, where('customerEmail', '==', userData.email));
    const purchasesSnapshot = await getDocs(purchasesQuery);
    console.log('Found purchases for user:', purchasesSnapshot.size);
    
    let latestOffer: Offer | null = null;
    let latestDate = new Date(0);
    
    purchasesSnapshot.forEach((doc) => {
      const offer = doc.data() as Offer;
      console.log('Purchase data:', offer);
      const offerDate = offer.createdAt instanceof Timestamp ? 
        offer.createdAt.toDate() : 
        (offer.createdAt || new Date(0));
      if (offerDate > latestDate) {
        latestOffer = offer;
        latestDate = offerDate;
      }
    });
    
    users.push({
      ...userData,
      id: userDoc.id,
      currentOffer: latestOffer,
      partnerProfile // Use the updated partnerProfile with sessionDates
    });
  }
  
  console.log('Final users list:', users);
  return users;
}
