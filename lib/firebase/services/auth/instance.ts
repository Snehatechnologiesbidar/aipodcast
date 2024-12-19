import { Auth, getAuth } from 'firebase/auth';
import { initializeFirebaseApp } from '../../app';

let auth: Auth | null = null;

export function getAuthInstance(): Auth {
  if (!auth) {
    const app = initializeFirebaseApp();
    auth = getAuth(app);
  }
  return auth;
}