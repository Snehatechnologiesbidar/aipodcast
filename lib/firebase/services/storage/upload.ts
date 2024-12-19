import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getStorageInstance } from './instance';

export interface UploadOptions {
  path: string;
  file: Blob | Uint8Array | ArrayBuffer;
  metadata?: { contentType?: string };
}

export async function uploadFile({ path, file, metadata }: UploadOptions): Promise<string> {
  const storage = getStorageInstance();
  const fileRef = ref(storage, path);
  
  await uploadBytes(fileRef, file, metadata);
  return getDownloadURL(fileRef);
}