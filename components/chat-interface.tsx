"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Send, Loader2, Bot, User } from 'lucide-react';
import { useChat } from 'ai/react';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { logEvent } from '@/lib/ga';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export function ChatInterface() {
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    initialMessages: [{ role: 'system', content: 'You are a helpful assistant.', id: 'system-message' }],
    onError: (error) => {
      console.error('Chat error:', error);
      setError('Failed to send message. Please try again later.');
      setTimeout(() => setError(null), 5000);
      logEvent('Chat', 'Error', error.message);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    logEvent('Chat', 'Message Sent', input.length.toString());
    await handleSubmit(e);
  };

  // Track when messages are received
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        logEvent('Chat', 'Response Received', lastMessage.content.length.toString());
      }
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[70vh] rounded-lg border bg-card">
      <Card className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/50">
        {messages.map((message, index) => (
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

        <form onSubmit={handleFormSubmit} className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => {
              handleInputChange(e);
              if (e.target.value.length % 50 === 0) {
                logEvent('Chat', 'Input Length', e.target.value.length.toString());
              }
            }}
            placeholder="Type your message..."
            className="min-h-[60px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleFormSubmit(e);
              }
            }}
          />
          <Button 
            type="submit" 
            disabled={isLoading} 
            className="h-[60px] px-6"
            onClick={() => logEvent('Chat', 'Send Button Clicked')}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
} 