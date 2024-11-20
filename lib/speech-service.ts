import { TextToSpeechOptions, SpeechResponse } from '@/types/speech';

export async function synthesizeSpeech(options: TextToSpeechOptions): Promise<SpeechResponse> {
  if (!options.text?.trim()) {
    throw new Error('Text content is required');
  }

  if (!options.voice?.trim()) {
    throw new Error('Voice selection is required');
  }

  try {
    const response = await fetch('/api/synthesize-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...options,
        text: options.text.trim(),
      }),
    });

    if (response.ok) {
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'synthesized-speech.wav' // Change the file name and extension as needed
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } else {
      console.error('Failed to download the file:', response.statusText)
    }
    return {
      audioContent: 'data.audioContent',
      duration: 2
    }
    
  
    //if (!response.ok) {
   //   const error = await response.json().catch(() => ({ message: 'Speech synthesis failed' }));
   //   throw new Error(error.message || 'Speech synthesis failed');
   // }

  //  const data = await response.json();
    
 //   if (!data.audioContent) {
  //    throw new Error('No audio content received from speech service');
 //   }
//
 //   return {
  //    audioContent: data.audioContent,
  //    duration: data.duration,
  //  };
  } catch (error) {
    console.error('Speech synthesis error:', error);
    throw error instanceof Error 
     ? error 
     : new Error('Failed to synthesize speech');
 }
}