import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Replace with your Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyAiFPPy9QCBW9viMo7SoS5NS4-sW0X_1jE",
  authDomain: "municipality-portal-8d76a.firebaseapp.com",
  projectId: "municipality-portal-8d76a",
  storageBucket: "municipality-portal-8d76a.firebasestorage.app",
  messagingSenderId: "1069879068107",
  appId: "1:1069879068107:web:2933242744b0a64670624e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
