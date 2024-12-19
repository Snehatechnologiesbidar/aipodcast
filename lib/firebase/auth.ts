import { getAuth } from 'firebase/auth';
import { initializeFirebaseApp } from './app';

// Initialize Firebase app and get auth instance
const app = initializeFirebaseApp();
export const auth = getAuth(app);