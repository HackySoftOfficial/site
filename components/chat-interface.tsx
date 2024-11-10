"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Send, Loader2, Bot, User } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Turnstile } from "@/components/turnstile";

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface CloudflareAIResponse {
  result: {
    response: string;
  };
  success: boolean;
  errors: string[];
  messages: string[];
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: 'You are a friendly assistant that helps users with technical questions.',
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [isTurnstileVerified, setIsTurnstileVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function runAI(userMessage: string) {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...messages,
            { role: 'user', content: userMessage }
          ],
          turnstileToken
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const result = await response.json() as CloudflareAIResponse;
      
      if (!result.success || result.errors.length > 0) {
        throw new Error(result.errors[0] || 'Failed to get AI response');
      }

      return result.result.response;
    } catch (error) {
      console.error('AI Error:', error);
      throw error;
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);
    setError(null);

    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const aiResponse = await runAI(userMessage);
      
      // Add AI response
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      setError('Failed to get response. Please try again.');
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  async function verifyAndProceed(token: string) {
    setIsVerifying(true);
    try {
      const response = await fetch('/api/verify-turnstile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error('Verification failed');
      }

      setTurnstileToken(token);
      setIsTurnstileVerified(true);
    } catch (error) {
      console.error('Verification error:', error);
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  }

  return (
    <div className="flex flex-col h-[70vh] rounded-lg border bg-card">
      {!isTurnstileVerified ? (
        <div className="flex flex-col items-center justify-center h-full space-y-6 p-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold">Verify to Continue</h2>
            <p className="text-muted-foreground">
              Please complete the verification to start chatting
            </p>
          </div>
          
          {isVerifying ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Verifying...</span>
            </div>
          ) : (
            <Turnstile
              onSuccess={verifyAndProceed}
              onError={() => {
                setError('Verification failed. Please try again.');
                setIsTurnstileVerified(false);
              }}
            />
          )}
          
          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>
      ) : (
        <>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.slice(1).map((message, index) => (
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
                      <User className="h-5 w-5" />
                    )}
                  </Avatar>
                  <div
                    className={cn(
                      "rounded-lg p-4",
                      message.role === 'user' 
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted border"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="border-t p-4 bg-background">
            {error && (
              <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="min-h-[60px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="h-[60px] px-6"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        </>
      )}
    </div>
  );
} 