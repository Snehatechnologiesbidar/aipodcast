"use client"

import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { config } from "@/lib/config";
import { createPodcastAudio } from "@/lib/script-generator";
import VoiceManager from "@/components/voice-manager";
import PodcastHeader from "./header";
import PodcastForm from "./podcast-form";
import NavigationButtons from "./navigation-buttons";

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
      <PodcastHeader />

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-8">
        {step === 1 && <VoiceManager />}

        {step === 2 && (
          <PodcastForm
            title={title}
            description={description}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onScriptGenerated={setScript}
          />
        )}

        <NavigationButtons
          step={step}
          isGenerating={isGenerating}
          hasScript={!!script}
          onPrevious={() => setStep(step - 1)}
          onNext={() => setStep(step + 1)}
          onGenerate={handleGeneratePodcast}
        />
      </div>
    </div>
  );
}