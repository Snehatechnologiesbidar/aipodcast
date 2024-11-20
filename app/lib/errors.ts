import { NextResponse } from 'next/server';

export class TTSError extends Error {
  constructor(message: string, public statusCode: number = 500) {
    super(message);
    this.name = 'TTSError';
  }
}

export function handleTTSError(error: unknown) {
  const ttsError = error instanceof TTSError 
    ? error 
    : new TTSError(error instanceof Error ? error.message : 'Internal server error');
    
  return NextResponse.json(
    { error: ttsError.message }, 
    { status: ttsError.statusCode }
  );
} 