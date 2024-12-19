import { Firestore, getFirestore, collection, addDoc, DocumentData } from 'firebase/firestore';
import { initializeFirebaseApp } from '../app';

let db: Firestore | null = null;

export function getFirestoreInstance(): Firestore {
  if (!db) {
    const app = initializeFirebaseApp();
    db = getFirestore(app);
  }
  return db;
}

export async function addDocument(
  collectionName: string, 
  data: DocumentData
): Promise<string> {
  const db = getFirestoreInstance();
  const docRef = await addDoc(collection(db, collectionName), data);
  return docRef.id;
}