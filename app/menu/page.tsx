"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Send, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { initWllama, getWllama } from '@/lib/wllama-client';

export default function MenuPage() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [modelLoadProgress, setModelLoadProgress] = useState(0);
  const [conversation, setConversation] = useState<Array<{role: string, content: string}>>([]);

  useEffect(() => {
    const loadModel = async () => {
      try {
        await initWllama((progress) => {
          const percentage = Math.round((progress.loaded / progress.total) * 100);
          setModelLoadProgress(percentage);
        });
        setIsModelLoading(false);
      } catch (error) {
        console.error('Failed to load model:', error);
        setConversation(prev => [...prev, {
          role: 'assistant',
          content: 'Failed to load the AI model. Please try refreshing the page.'
        }]);
      }
    };

    loadModel();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isModelLoading) return;

    setIsLoading(true);
    setConversation(prev => [...prev, { role: 'user', content: input }]);

    try {
      const wllama = getWllama();
      const response = await wllama.createCompletion(input, {
        nPredict: 256,
        sampling: {
          temp: 0.7,
          top_k: 40,
          top_p: 0.9,
        },
      });

      setConversation(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error:', error);
      setConversation(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request.'
      }]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  return (
    <main className="container mx-auto px-4 py-24">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Menu Assistant (Local LLM)</h1>
              <p className="text-muted-foreground">
                Powered by wllama - running directly in your browser
              </p>
            </div>
          </div>

          {isModelLoading && (
            <div className="mb-8">
              <p className="text-sm text-muted-foreground mb-2">
                Loading AI model... {modelLoadProgress}%
              </p>
              <Progress value={modelLoadProgress} className="w-full" />
            </div>
          )}

          <div className="space-y-4 mb-4 h-[400px] overflow-y-auto">
            {conversation.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  msg.role === 'assistant' ? 'bg-muted/50 p-4 rounded-lg' : ''
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {msg.role === 'assistant' ? (
                    <Bot className="h-4 w-4 text-primary" />
                  ) : (
                    <div className="h-4 w-4 bg-primary rounded-full" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isModelLoading ? "Loading model..." : "Type your message..."}
              className="flex-1"
              disabled={isModelLoading}
            />
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim() || isModelLoading}
              className="h-[60px] px-6"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
} 