import { FirebaseOptions } from 'firebase/app';
import { firebaseConfig } from '../config';

export function validateConfig(): FirebaseOptions {
  if (!firebaseConfig.apiKey) {
    throw new Error('Firebase API key not found in environment variables');
  }
  
  if (!firebaseConfig.authDomain) {
    throw new Error('Firebase auth domain not found in environment variables');
  }
  
  if (!firebaseConfig.projectId) {
    throw new Error('Firebase project ID not found in environment variables');
  }
  
  if (!firebaseConfig.storageBucket) {
    throw new Error('Firebase storage bucket not found in environment variables');
  }
  
  return firebaseConfig;
}