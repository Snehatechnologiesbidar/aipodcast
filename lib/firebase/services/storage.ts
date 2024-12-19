import { FirebaseStorage, getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeFirebaseApp } from '../app';

let storage: FirebaseStorage | null = null;

export function getStorageInstance(): FirebaseStorage {
  if (!storage) {
    const app = initializeFirebaseApp();
    storage = getStorage(app);
  }
  return storage;
}

export async function uploadFile(
  path: string, 
  file: Blob | Uint8Array | ArrayBuffer,
  metadata?: { contentType?: string }
): Promise<string> {
  const storage = getStorageInstance();
  const fileRef = ref(storage, path);
  
  await uploadBytes(fileRef, file, metadata);
  return getDownloadURL(fileRef);
}