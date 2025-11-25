// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Mock Firebase configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "mock-api-key",
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "swiftserve-ai.firebaseapp.com",
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "swiftserve-ai",
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "swiftserve-ai.appspot.com",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
    appId: process.env.REACT_APP_FIREBASE_APP_ID || "mock-app-id"
};

// Initialize Firebase
let app;
let db;
let auth;

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
} catch (error) {
    console.warn('Firebase initialization failed, using mock mode:', error);
    // In mock mode, we'll use local state management
}

export { app, db, auth };
export default firebaseConfig;
