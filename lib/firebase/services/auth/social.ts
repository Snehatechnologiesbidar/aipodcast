import { signInWithPopup } from 'firebase/auth';
import { getAuthInstance } from './instance';
import { providers } from '../providers';

export async function signInWithGoogle() {
  const auth = getAuthInstance();
  try {
    const result = await signInWithPopup(auth, providers.google);
    return result.user;
  } catch (error: any) {
    throw new Error(error.message || 'Google sign in failed');
  }
}

export async function signInWithGithub() {
  const auth = getAuthInstance();
  try {
    const result = await signInWithPopup(auth, providers.github);
    return result.user;
  } catch (error: any) {
    throw new Error(error.message || 'GitHub sign in failed');
  }
}