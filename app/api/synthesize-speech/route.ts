import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { validateGoogleCredentials } from '@/lib/config';
import { TTSError, handleTTSError } from '@/lib/errors';
import { NextResponse } from 'next/server';

const getTextToSpeechClient = () => {
  const credentials = validateGoogleCredentials();
  return new TextToSpeechClient({
    credentials: {
      client_email: credentials.clientEmail,
      private_key: credentials.privateKey,
    },
  });
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, voice, language } = body;

    if (!text) {
      throw new TTSError('Text is required', 400);
    }

    const client = getTextToSpeechClient();
    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice: {
        languageCode: language || 'en-US',
        name: voice || 'en-US-Standard-A',
      },
      audioConfig: { audioEncoding: 'MP3' },
    });

    return new NextResponse(response.audioContent, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'attachment; filename="speech.mp3"',
      },
    });
  } catch (error) {
    return handleTTSError(error);
  }
}
