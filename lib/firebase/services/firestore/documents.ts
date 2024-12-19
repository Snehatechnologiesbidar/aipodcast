import { collection, addDoc, DocumentData } from 'firebase/firestore';
import { getFirestoreInstance } from './instance';

export async function addDocument(
  collectionName: string, 
  data: DocumentData
): Promise<string> {
  const db = getFirestoreInstance();
  const docRef = await addDoc(collection(db, collectionName), data);
  return docRef.id;
}