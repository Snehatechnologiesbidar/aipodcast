import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { firebaseConfig, validateFirebaseConfig } from './config';

let app: FirebaseApp | null = null;

export function initializeFirebaseApp(): FirebaseApp {
  if (!app) {
    if (getApps().length === 0) {
      validateFirebaseConfig();
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
  }
  return app;
}