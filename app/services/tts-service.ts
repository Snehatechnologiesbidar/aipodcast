import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import type { TTSRequest } from '../types/tts';
import { TTSError } from '../lib/errors';

export class TTSService {
  private client: TextToSpeechClient;

  constructor(client: TextToSpeechClient) {
    this.client = client;
  }

  async synthesizeSpeech(request: TTSRequest) {
    if (!request.text.trim()) {
      throw new TTSError('Text cannot be empty', 400);
    }

    try {
      const [response] = await this.client.synthesizeSpeech({
        input: { text: request.text },
        voice: {
          languageCode: request.language || 'en-US',
          name: request.voice || 'en-US-Standard-A',
        },
        audioConfig: { audioEncoding: 'MP3' },
      });

      return response;
    } catch (error) {
      throw new TTSError(
        error instanceof Error ? error.message : 'Speech synthesis failed',
        500
      );
    }
  }
} 