"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Download, Image as ImageIcon, Loader2, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/components/ui/use-toast';

interface AIArtResponse {
  result?: {
    image: string;
  };
  error?: string;
}

export function AIArtGenerator() {
  const [prompt, setPrompt] = useState('');
  const [numSteps, setNumSteps] = useState(4);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/aiart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          numSteps
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json() as AIArtResponse;
      
      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.result?.image) {
        throw new Error('No image data received');
      }

      setGeneratedImage(data.result.image);
      toast({
        title: "Success",
        description: "Image generated successfully!",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to generate image. Please try again.",
        variant: "destructive",
      });
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${generatedImage}`;
    link.download = `ai-art-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card className="p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Describe your image
          </label>
          <Textarea
            placeholder="A serene landscape with mountains at sunset..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[120px] resize-none"
            disabled={isGenerating}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Quality Steps: {numSteps}</span>
            <span className="text-muted-foreground">Higher = Better Quality</span>
          </div>
          <Slider
            value={[numSteps]}
            onValueChange={([value]) => setNumSteps(value)}
            min={1}
            max={8}
            step={1}
            disabled={isGenerating}
          />
        </div>

        <Button
          className="w-full"
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <ImageIcon className="mr-2 h-4 w-4" />
              Generate Image
            </>
          )}
        </Button>
      </Card>

      <Card className="p-6 flex flex-col">
        <div className="flex-1 relative min-h-[300px] rounded-lg overflow-hidden bg-muted/30">
          {generatedImage ? (
            <Image
              src={`data:image/png;base64,${generatedImage}`}
              alt="Generated artwork"
              fill
              className="object-contain"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <p className="text-center">
                Your generated image will appear here
              </p>
            </div>
          )}
        </div>
        
        {generatedImage && (
          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleDownload}
              className="gap-2"
              variant="outline"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}