"use client"

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Mic, Globe } from "lucide-react";
import VoiceManager from "@/components/voice-manager";
import ScriptGenerator from "@/components/script-generator";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createPodcastAudio } from "@/lib/script-generator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { config } from "@/lib/config";

export default function CreatePodcast() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [script, setScript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePodcast = async () => {
    if (!script) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please generate or write a script first",
      });
      return;
    }

    if (!config.google.clientEmail || !config.google.privateKey) {
      setError('Google Cloud credentials not found in environment variables');
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      const audioUrl = await createPodcastAudio(script, 'en-US-Neural2-D');
      
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = `${title.replace(/\s+/g, '-').toLowerCase()}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Success",
        description: "Podcast generated and downloaded successfully!",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate podcast';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create a Podcast</h1>
        <p className="text-muted-foreground">Generate AI-powered podcasts from your content</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-8">
        {step === 1 && (
          <VoiceManager />
        )}

        {step === 2 && (
          <Card className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Podcast title</label>
              <Input 
                placeholder="The Sample Podcast" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea 
                placeholder="Write a short description about the podcast"
                className="min-h-[100px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <ScriptGenerator
              title={title}
              description={description}
              onScriptGenerated={setScript}
            />

            <div className="space-y-4">
              <label className="block text-sm font-medium">Podcast Thumbnail</label>
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1">
                  AI prompt to generate thumbnail
                </Button>
                <Button variant="outline" className="flex-1">
                  Upload custom image
                </Button>
              </div>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  SVG, PNG, JPG or GIF (max. 1080x1080px)
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="flex justify-between">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Previous
            </Button>
          )}
          {step < 2 && (
            <Button className="ml-auto" onClick={() => setStep(step + 1)}>
              Next
            </Button>
          )}
          {step === 2 && (
            <Button 
              className="ml-auto" 
              onClick={handleGeneratePodcast}
              disabled={isGenerating || !script}
            >
              <Mic className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate Podcast'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}