import { NextResponse } from 'next/server';

export class TTSError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'TTSError';
  }
}

export function handleTTSError(error: unknown) {
  if (error instanceof TTSError) {
    return new NextResponse(error.message, { status: error.statusCode });
  }
  console.error('TTS Error:', error);
  return new NextResponse('Internal Server Error', { status: 500 });
} 