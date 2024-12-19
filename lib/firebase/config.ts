import { FirebaseOptions } from 'firebase/app';

export const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Validate Firebase configuration
export function validateFirebaseConfig() {
  const config = firebaseConfig;
  
  if (!config.apiKey) {
    throw new Error('Firebase API key not found in environment variables');
  }
  
  if (!config.authDomain) {
    throw new Error('Firebase auth domain not found in environment variables');
  }
  
  if (!config.projectId) {
    throw new Error('Firebase project ID not found in environment variables');
  }
  
  if (!config.storageBucket) {
    throw new Error('Firebase storage bucket not found in environment variables');
  }
  
  return config;
}