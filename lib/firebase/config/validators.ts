import { firebaseEnv } from './env';

export function validateFirebaseConfig() {
  const requiredVars = [
    { key: 'apiKey', name: 'API Key' },
    { key: 'authDomain', name: 'Auth Domain' },
    { key: 'projectId', name: 'Project ID' },
    { key: 'storageBucket', name: 'Storage Bucket' },
    { key: 'appId', name: 'App ID' }
  ] as const;

  for (const { key, name } of requiredVars) {
    if (!firebaseEnv[key as keyof typeof firebaseEnv]) {
      throw new Error(`Firebase ${name} not found in environment variables`);
    }
  }

  return firebaseEnv;
}