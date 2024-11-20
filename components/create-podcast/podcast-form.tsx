"use client"

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ScriptGenerator from "@/components/script-generator";
import ThumbnailUploader from "./thumbnail-uploader";

interface PodcastFormProps {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onScriptGenerated: (script: string) => void;
}

export default function PodcastForm({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onScriptGenerated,
}: PodcastFormProps) {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Podcast title</label>
        <Input 
          placeholder="The Sample Podcast" 
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <Textarea 
          placeholder="Write a short description about the podcast"
          className="min-h-[100px]"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </div>

      <ScriptGenerator
        title={title}
        description={description}
        onScriptGenerated={onScriptGenerated}
      />

      <ThumbnailUploader />
    </Card>
  );
}