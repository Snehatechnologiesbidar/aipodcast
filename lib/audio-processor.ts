import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { storage, db } from './firebase';
import { v4 as uuidv4 } from 'uuid';

interface AudioMetadata {
  title?: string;
  text: string;
  voice: string;
  duration?: number;
}

export async function processAudioContent(
  audioContent: string,
  metadata: AudioMetadata
): Promise<string> {
  if (!audioContent) {
    throw new Error('No audio content provided');
  }

  try {
    // Convert base64 to blob
    const audioBlob = await fetch(`data:audio/mp3;base64,${audioContent}`)
      .then(r => {
        if (!r.ok) throw new Error('Failed to process audio data');
        return r.blob();
      });

    if (!audioBlob || audioBlob.size === 0) {
      throw new Error('Invalid audio data received');
    }

    // Generate unique filename
    const fileName = `podcasts/${uuidv4()}-${Date.now()}.mp3`;
    const storageRef = ref(storage, fileName);
    
    // Upload to Firebase Storage
    const uploadResult = await uploadBytes(storageRef, audioBlob);
    if (!uploadResult.ref) {
      throw new Error('Failed to upload audio file');
    }

    // Get download URL
    const downloadUrl = await getDownloadURL(uploadResult.ref);
    if (!downloadUrl) {
      throw new Error('Failed to get download URL');
    }

    // Save metadata to Firestore
    await addDoc(collection(db, 'podcasts'), {
      ...metadata,
      audioUrl: downloadUrl,
      createdAt: new Date().toISOString(),
      fileName,
      fileSize: audioBlob.size,
      mimeType: audioBlob.type,
    });

    return downloadUrl;
  } catch (error) {
    console.error('Audio processing error:', error);
    throw error instanceof Error 
      ? error 
      : new Error('Failed to process audio content');
  }
}