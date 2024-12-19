import { Firestore, getFirestore } from 'firebase/firestore';
import { initializeFirebaseApp } from '../../app';

let db: Firestore | null = null;

export function getFirestoreInstance(): Firestore {
  if (!db) {
    const app = initializeFirebaseApp();
    db = getFirestore(app);
  }
  return db;
}