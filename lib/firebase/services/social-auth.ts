import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { getAuthInstance } from './auth';

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export async function signInWithGoogle() {
  const auth = getAuthInstance();
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    throw new Error(error.message || 'Google sign in failed');
  }
}

export async function signInWithGithub() {
  const auth = getAuthInstance();
  try {
    const result = await signInWithPopup(auth, githubProvider);
    return result.user;
  } catch (error: any) {
    throw new Error(error.message || 'GitHub sign in failed');
  }
}