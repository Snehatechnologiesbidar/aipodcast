import { GoogleGenerativeAI } from '@google/generative-ai';
import { synthesizeSpeech } from './speech-service';
import { processAudioContent } from './audio-processor';
import { config, validateGoogleCredentials } from './config';

const genAI = new GoogleGenerativeAI(config.gemini.apiKey || '');

export async function generatePodcastScript(title: string, description: string): Promise<string> {
  if (!config.gemini.apiKey) {
    throw new Error('Gemini API key not found in environment variables');
  }

  if (!title?.trim()) {
    throw new Error('Podcast title is required');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Create a podcast script for a show titled "${title}". Description: ${description}. Include an intro, main content sections, and outro. Make it engaging and conversational.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const script = response.text();

    if (!script?.trim()) {
      throw new Error('No script content was generated');
    }

    return script;
  } catch (error: any) {
    console.error('Script generation error:', error);
    if (error?.message?.includes('QUOTA_EXCEEDED')) {
      throw new Error('API quota exceeded. Please check your billing details or try again later.');
    }
    throw new Error('Failed to generate podcast script. Please check your API key and try again.');
  }
}

export async function createPodcastAudio(
  text: string,
  voice: string,
  title?: string
): Promise<string> {
  try {
    validateGoogleCredentials();

    if (!text?.trim()) {
      throw new Error('Script content is required');
    }

    if (!voice?.trim()) {
      throw new Error('Voice selection is required');
    }

    const speechResponse = await synthesizeSpeech({ 
      text, 
      voice,
      language: 'en-US',
      speakingRate: 1.0,
      pitch: 0.0,
      volumeGainDb: 0.0
    });

    if (!speechResponse.audioContent) {
      throw new Error('No audio content received from the speech service');
    }

    const downloadUrl = await processAudioContent(
      speechResponse.audioContent,
      {
        title,
        text,
        voice,
        duration: speechResponse.duration
      }
    );

    if (!downloadUrl) {
      throw new Error('Failed to process the generated audio');
    }

    return downloadUrl;
  } catch (error) {
    console.error('Podcast audio creation error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to create podcast audio. Please check your credentials and try again.');
  }
}