import { Auth, getAuth, User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { initializeFirebaseApp } from '../app';

let auth: Auth | null = null;

export function getAuthInstance(): Auth {
  if (!auth) {
    const app = initializeFirebaseApp();
    auth = getAuth(app);
  }
  return auth;
}

export async function signIn(email: string, password: string): Promise<User> {
  const auth = getAuthInstance();
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign in');
  }
}

export async function signUp(email: string, password: string): Promise<User> {
  const auth = getAuthInstance();
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create account');
  }
}

export async function signOutUser(): Promise<void> {
  const auth = getAuthInstance();
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign out');
  }
}

export function getCurrentUser(): User | null {
  const auth = getAuthInstance();
  return auth.currentUser;
}

export function onAuthStateChanged(callback: (user: User | null) => void): () => void {
  const auth = getAuthInstance();
  return auth.onAuthStateChanged(callback);
}