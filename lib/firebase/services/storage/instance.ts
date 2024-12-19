import { FirebaseStorage, getStorage } from 'firebase/storage';
import { initializeFirebaseApp } from '../../app';

let storage: FirebaseStorage | null = null;

export function getStorageInstance(): FirebaseStorage {
  if (!storage) {
    const app = initializeFirebaseApp();
    storage = getStorage(app);
  }
  return storage;
}