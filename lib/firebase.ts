import { initializeApp } from 'firebase/app'
import { getFunctions } from 'firebase/functions'

const firebaseConfig = {
  apiKey: "AIzaSyBwRASncivRPjaRONIU9KSxyg9Nq3fyutY",
  authDomain: "coeurs-a-corps.firebaseapp.com",
  projectId: "coeurs-a-corps",
  storageBucket: "coeurs-a-corps.firebasestorage.app",
  messagingSenderId: "311547169034",
  appId: "1:311547169034:web:933f73c2392d182fe752f3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const functions = getFunctions(app)
