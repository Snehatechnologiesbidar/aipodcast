export interface TextToSpeechOptions {
  text: string;
  voice: string;
  language?: string;
  speakingRate?: number;
  pitch?: number;
  volumeGainDb?: number;
}

export interface SpeechResponse {
  audioContent: string;
  duration?: number;
}

export interface TTSClientConfig {
  credentials: {
    client_email: string;
    private_key: string;
  };
}

export interface AudioProcessingError extends Error {
  code?: string;
  details?: unknown;
}