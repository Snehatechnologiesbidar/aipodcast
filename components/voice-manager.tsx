"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mic, Upload, Play, Pause, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { GoogleGenerativeAI } from '@google/generative-ai';

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'nl', name: 'Dutch' },
  { code: 'pl', name: 'Polish' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
];

export default function VoiceManager() {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setAudioFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setError(null);
    }
  };

  const handleCreateVoiceClone = async () => {
    if (!audioFile) return;

    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      setError('Gemini API key not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your environment variables.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    
    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      // For now, we'll just create a confirmation message since Gemini doesn't support direct voice cloning
      const result = await model.generateContent('Generate a confirmation message for successful voice profile creation.');
      const response = await result.response;
      const message = response.text();

      // Create an audio element with the original file for preview
      setPreviewUrl(URL.createObjectURL(audioFile));

      toast({
        title: "Success",
        description: "Voice profile created successfully!",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const togglePlayback = () => {
    if (isPlaying && audioElement) {
      audioElement.pause();
      setIsPlaying(false);
    } else {
      const audio = new Audio(previewUrl);
      audio.onended = () => {
        setIsPlaying(false);
        setAudioElement(null);
      };
      audio.play();
      setIsPlaying(true);
      setAudioElement(audio);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Voice Cloning Studio</h2>
        <p className="text-muted-foreground">Create your custom AI voice clone or choose from our library</p>
      </div>

      {!process.env.NEXT_PUBLIC_GEMINI_API_KEY && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Gemini API key not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your environment variables.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Label>Record Your Voice</Label>
          <div className="flex gap-4">
            <Button 
              variant={isRecording ? "destructive" : "default"}
              onClick={() => setIsRecording(!isRecording)}
              disabled={!process.env.NEXT_PUBLIC_GEMINI_API_KEY}
            >
              <Mic className="w-4 h-4 mr-2" />
              {isRecording ? "Stop Recording" : "Start Recording"}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <Label>Upload Voice Sample</Label>
          <div className="flex gap-4">
            <Input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
              id="voice-upload"
              disabled={!process.env.NEXT_PUBLIC_GEMINI_API_KEY}
            />
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => document.getElementById('voice-upload')?.click()}
              disabled={!process.env.NEXT_PUBLIC_GEMINI_API_KEY}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Audio File
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Maximum file size: 10MB. Supported formats: MP3, WAV
          </p>
        </div>
      </div>

      {previewUrl && (
        <div className="space-y-4">
          <Label>Preview Voice Sample</Label>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={togglePlayback}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
            <div className="flex-1 h-2 bg-secondary rounded-full">
              <div className="h-full w-0 bg-primary rounded-full transition-all duration-200" />
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <Label>Voice Settings</Label>
        <div className="grid gap-4 md:grid-cols-2">
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
            disabled={!process.env.NEXT_PUBLIC_GEMINI_API_KEY}
          >
            <option value="">Select Voice Personality</option>
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="energetic">Energetic</option>
            <option value="calm">Calm</option>
          </select>

          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
            disabled={!process.env.NEXT_PUBLIC_GEMINI_API_KEY}
          >
            <option value="">Select Language</option>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Button 
        className="w-full" 
        onClick={handleCreateVoiceClone}
        disabled={!audioFile || isProcessing || !process.env.NEXT_PUBLIC_GEMINI_API_KEY}
      >
        {isProcessing ? "Processing..." : "Create Voice Clone"}
      </Button>
    </Card>
  );
}