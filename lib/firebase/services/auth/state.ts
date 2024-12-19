import { User } from 'firebase/auth';
import { getAuthInstance } from './instance';

export function getCurrentUser(): User | null {
  const auth = getAuthInstance();
  return auth.currentUser;
}

export function onAuthStateChanged(callback: (user: User | null) => void): () => void {
  const auth = getAuthInstance();
  return auth.onAuthStateChanged(callback);
}