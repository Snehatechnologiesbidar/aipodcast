export const config = {
  google: {
    clientEmail: process.env.NEXT_PUBLIC_GOOGLE_CLOUD_CLIENT_EMAIL,
    privateKey: process.env.NEXT_PUBLIC_GOOGLE_CLOUD_PRIVATE_KEY,
    projectId: process.env.NEXT_PUBLIC_GOOGLE_CLOUD_PROJECT_ID
  },
  gemini: {
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY
  }
} as const;

export function validateGoogleCredentials() {
  const { clientEmail, privateKey } = config.google;
  
  if (!clientEmail?.trim()) {
    throw new Error('Google Cloud client email not found in environment variables');
  }
  
  if (!privateKey?.trim()) {
    throw new Error('Google Cloud private key not found in environment variables');
  }
  
  return {
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, '\n')
  };
}