"use client";

import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Send, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { initWllama, getWllama } from '@/lib/wllama-client';
import { initGA, logPageView, logEvent } from '@/lib/ga';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [modelLoadProgress, setModelLoadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [conversation, setConversation] = useState<Array<{role: string, content: string}>>([
    { role: 'system', content: 'You are a helpful assistant.' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initGA();
    logPageView();

    const loadModel = async () => {
      try {
        await initWllama((progress) => {
          const percentage = Math.round((progress.loaded / progress.total) * 100);
          setModelLoadProgress(percentage);
          logEvent('Chat', 'Model Loading', `Progress: ${percentage}%`);
        });
        setIsModelLoading(false);
        logEvent('Chat', 'Model Loaded', 'Success');
      } catch (error) {
        console.error('Failed to load model:', error);
        setError('Failed to load the AI model. Please try refreshing the page.');
        logEvent('Chat', 'Model Load Error', error instanceof Error ? error.message : 'Unknown error');
      }
    };

    loadModel();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isModelLoading) return;

    setIsLoading(true);
    setError(null);
    logEvent('Chat', 'Message Sent', input.length.toString());

    setConversation(prev => [...prev, { role: 'user', content: input }]);

    try {
      const wllama = getWllama();
      const response = await wllama.createCompletion(input, {
        nPredict: 512,
        sampling: {
          temp: 0.7,
          top_k: 40,
          top_p: 0.9,
        },
      });

      setConversation(prev => [...prev, { role: 'assistant', content: response }]);
      logEvent('Chat', 'Response Received', response.length.toString());
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to generate response. Please try again.');
      logEvent('Chat', 'Response Error', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">AI Assistant</h1>
            <p className="text-muted-foreground">
              Powered by local LLM - running directly in your browser
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col h-[70vh] rounded-lg border bg-card">
          <Card className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/50">
            {isModelLoading && (
              <div className="mb-8">
                <p className="text-sm text-muted-foreground mb-2">
                  Loading AI model... {modelLoadProgress}%
                </p>
                <Progress value={modelLoadProgress} className="w-full" />
              </div>
            )}

            {conversation.filter(msg => msg.role !== 'system').map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex gap-3 max-w-[85%]",
                  message.role === 'user' ? "ml-auto" : "mr-auto"
                )}
              >
                <Avatar className={cn("h-8 w-8", message.role === 'user' && "order-last")}>
                  {message.role === 'assistant' ? (
                    <Bot className="h-5 w-5 text-primary" />
                  ) : (
                    <div className="h-5 w-5 bg-primary rounded-full" />
                  )}
                </Avatar>
                <div
                  className={cn(
                    "rounded-lg p-4",
                    message.role === 'user' 
                      ? "bg-primary text-primary-foreground"
                      : "bg-background border shadow-sm"
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </Card>

          <div className="border-t p-4 bg-background">
            {error && (
              <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  if (e.target.value.length % 50 === 0) {
                    logEvent('Chat', 'Input Length', e.target.value.length.toString());
                  }
                }}
                placeholder={isModelLoading ? "Loading model..." : "Type your message..."}
                className="min-h-[60px] resize-none"
                disabled={isModelLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <Button 
                type="submit" 
                disabled={isLoading || !input.trim() || isModelLoading}
                className="h-[60px] px-6"
                onClick={() => logEvent('Chat', 'Send Button Clicked')}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 