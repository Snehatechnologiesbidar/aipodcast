import { User } from 'firebase/auth';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getAuthInstance } from './instance';

export async function signInWithEmail(email: string, password: string): Promise<User> {
  const auth = getAuthInstance();
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign in');
  }
}

export async function signUpWithEmail(email: string, password: string): Promise<User> {
  const auth = getAuthInstance();
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create account');
  }
}