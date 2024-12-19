import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  User
} from 'firebase/auth';
import { auth } from '../firebase/auth';
import { googleProvider, githubProvider } from './providers';
import { AuthError } from './types';

export async function signIn(email: string, password: string): Promise<User> {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error: any) {
    throw {
      code: error.code,
      message: error.message
    } as AuthError;
  }
}

export async function signUp(email: string, password: string): Promise<User> {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error: any) {
    throw {
      code: error.code,
      message: error.message
    } as AuthError;
  }
}

export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    throw {
      code: error.code,
      message: error.message
    } as AuthError;
  }
}

export async function signInWithGithub(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    return result.user;
  } catch (error: any) {
    throw {
      code: error.code,
      message: error.message
    } as AuthError;
  }
}

export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    throw {
      code: error.code,
      message: error.message
    } as AuthError;
  }
}