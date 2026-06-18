import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "philosophyaiedu",
  appId: "1:725395040949:web:3225ed1cf9bf0b60f72cfc",
  storageBucket: "philosophyaiedu.firebasestorage.app",
  apiKey: "AIzaSyC1oUvMWUSROW571eAFCDvk8qjiDbzljs4",
  authDomain: "philosophyaiedu.firebaseapp.com",
  messagingSenderId: "725395040949",
  measurementId: "G-ZV5PMJF04W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
