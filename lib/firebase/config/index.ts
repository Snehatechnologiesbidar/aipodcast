import { FirebaseOptions } from 'firebase/app';
import { firebaseEnv } from './env';
import { validateFirebaseConfig } from './validators';

export const firebaseConfig: FirebaseOptions = firebaseEnv;

export { validateFirebaseConfig };