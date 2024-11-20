"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { generatePodcastScript } from '@/lib/script-generator';

interface ScriptGeneratorProps {
  title: string;
  description: string;
  onScriptGenerated: (script: string) => void;
}

export default function ScriptGenerator({ title, description, onScriptGenerated }: ScriptGeneratorProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [script, setScript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleGenerateScript = async () => {
    if (!title) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a podcast title",
      });
      return;
    }

    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      setError('Gemini API key not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your environment variables.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      const generatedScript = await generatePodcastScript(title, description);
      setScript(generatedScript);
      onScriptGenerated(generatedScript);
      toast({
        title: "Success",
        description: "Podcast script generated successfully!",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate script';
      if (errorMessage.includes('quota')) {
        setError('Gemini API quota exceeded. Please check your billing details or try again later.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium">AI prompt to generate podcast</label>
        <Button
          variant="outline"
          onClick={handleGenerateScript}
          disabled={isGenerating || !process.env.NEXT_PUBLIC_GEMINI_API_KEY}
        >
          {isGenerating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Generate Script
        </Button>
      </div>
      <Textarea
        value={script}
        onChange={(e) => {
          setScript(e.target.value);
          onScriptGenerated(e.target.value);
        }}
        placeholder={!process.env.NEXT_PUBLIC_GEMINI_API_KEY 
          ? "Gemini API key not configured. Please add your API key to use AI generation, or write your script manually."
          : "Click 'Generate Script' to create a podcast script, or write your own"}
        className="min-h-[200px]"
      />
    </div>
  );
}