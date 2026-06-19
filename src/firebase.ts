import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "chefport-1c732",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:361387601686:web:632f026a241cfcc082aa37",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "chefport-1c732.firebasestorage.app",
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD1g6LFhGGyupUTnciWecFaI3t-rFdfg58",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "chefport-1c732.firebaseapp.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "361387601686",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-2EDKC0W1FD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
// Configure Google Auth provider settings
googleProvider.setCustomParameters({ prompt: 'select_account' });

