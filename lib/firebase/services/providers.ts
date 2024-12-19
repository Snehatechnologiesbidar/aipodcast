import { GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';

export const providers = {
  google: new GoogleAuthProvider(),
  github: new GithubAuthProvider()
} as const;