import { Metadata } from 'next';
import { AIArtGenerator } from '@/components/ai-art-generator';

export const metadata: Metadata = {
  title: 'AI Art Generator - HackySoftX',
  description: 'Create unique AI-generated artwork using Cloudflare\'s FLUX model',
};

export default function AIArtPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">AI Art Generator</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your ideas into stunning artwork using our AI-powered image generation. 
            Powered by Cloudflare&apos;s FLUX model.
          </p>
        </div>
        <AIArtGenerator />
      </div>
    </div>
  );
} 