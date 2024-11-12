"use client";

import { useState, useEffect } from 'react';
import { Turnstile } from '@/components/turnstile';
import { useChatStore } from '@/lib/stores/chat-store';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { ImagePlus, Send } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';
import { useSettings } from '@/lib/stores/settings-store';
import type { ChatMessage, ApiResponse } from '@/lib/types';

export default function ChatInterface() {
  const [token, setToken] = useState<string | null>(null);
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    chats, 
    currentChatId, 
    createChat, 
    updateChat 
  } = useChatStore();

  const { settings } = useSettings();
  
  const currentChat = chats.find(chat => chat.id === currentChatId);

  useEffect(() => {
    const isDevEnvironment = 
      process.env.NODE_ENV === 'development' || 
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1';
    
    setIsDevelopment(isDevEnvironment);
    
    if (isDevEnvironment) {
      setToken('development');
    }
  }, []);

  const handleVerification = async (turnstileToken: string) => {
    if (isDevelopment) {
      setToken('development');
      return;
    }

    try {
      const response = await fetch('/api/verify-turnstile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: turnstileToken }),
      });

      const data = await response.json();

      if (data.success) {
        setToken('verified');
      }
    } catch (error) {
      console.error('Error verifying captcha:', error);
    }
  };

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setInput('');

    if (!currentChatId) {
      createChat();
    }

    const messages = currentChat 
      ? [...currentChat.messages, userMessage]
      : [userMessage];

    updateChat(currentChatId!, messages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          token,
          model: settings.model,
          type: 'text',
          provider: settings.provider
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json() as ApiResponse;
      
      if (!data.success) {
        throw new Error(data.errors[0] || 'Unknown error occurred');
      }

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.result.response
      };

      const updatedMessages = [...messages, assistantMessage];
      
      // Generate title after first AI response
      if (messages.length === 1) {
        const title = await generateChatTitle(updatedMessages, settings);
        updateChat(currentChatId!, updatedMessages, title || 'New Chat');
      } else {
        updateChat(currentChatId!, updatedMessages);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      };
      updateChat(currentChatId!, [...messages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-lg font-semibold">Verify to Continue</h2>
          <p className="text-muted-foreground">Please complete the verification to access the chat.</p>
        </div>
        <Turnstile
          onSuccess={handleVerification}
          onError={() => {
            console.error("Verification failed");
          }}
        />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-[calc(100vh-10rem)]">
      <ScrollArea className="flex-1 p-4 pb-[80px]">
        <div className="space-y-4">
          {currentChat?.messages.map((message, i) => (
            <div
              key={i}
              className={cn(
                "flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                message.role === 'user' 
                  ? "ml-auto bg-primary text-primary-foreground" 
                  : "bg-muted"
              )}
            >
              {message.content}
            </div>
          ))}
          {isLoading && (
            <div className="bg-muted rounded-lg px-3 py-2 text-sm animate-pulse">
              Thinking...
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="absolute bottom-0 left-0 right-0 bg-background border-t p-4">
        <div className="flex gap-2 max-w-[1200px] mx-auto">
          <Button 
            size="icon" 
            variant="ghost"
            className="shrink-0"
            disabled={isLoading}
          >
            <ImagePlus className="h-5 w-5" />
          </Button>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="min-h-[44px] resize-none"
            rows={1}
            disabled={isLoading}
          />
          <Button 
            size="icon"
            className="shrink-0"
            onClick={handleSubmit}
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}