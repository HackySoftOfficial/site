"use client";

import { useState, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ArrowUp, ImagePlus } from "lucide-react";
import { ImageResponse } from '@/lib/types';
import { Turnstile } from '@/components/turnstile';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  image?: string;
}

interface ApiResponse {
  result: {
    response: string;
    images?: string[];
  };
}

interface ChatContentProps {
  token: string | null;
  onVerify: (token: string) => void;
}

type ButtonVariant = 'outline' | 'ghost' | 'default';
type ButtonSize = 'icon' | 'sm' | 'default';

export default function ChatContent({ token, onVerify }: ChatContentProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: 'You are a helpful and knowledgeable assistant that can understand both text and images. You aim to be direct and clear while maintaining professional boundaries and safety guidelines.',
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <p className="text-muted-foreground">Please complete verification to continue</p>
        <Turnstile
          onSuccess={onVerify}
          onError={() => {
            console.error("Verification failed");
          }}
        />
      </div>
    );
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSendMessage = async () => {
    if ((!inputValue.trim() && !selectedImage) || !token) return;

    let userMessage: Message = { role: 'user', content: inputValue.trim() };
    
    if (selectedImage) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        userMessage.image = base64Image.split(',')[1];
        
        await sendMessageWithImage(userMessage);
      };
      reader.readAsDataURL(selectedImage);
    } else {
      await sendMessageWithImage(userMessage);
    }

    setInputValue('');
    setSelectedImage(null);
  };

  const sendMessageWithImage = async (userMessage: Message) => {
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          token,
          model: '@cf/meta/llama-3.2-11b-vision-instruct' as const,
          type: 'text' as const,
          provider: 'cloudflare' as const
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json() as ApiResponse;
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.result.response
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.slice(1).map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "rounded-lg px-4 py-2 max-w-[80%] shadow-sm",
                  message.role === "user" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted"
                )}
              >
                {message.image ? (
                  <img 
                    src={`data:image/png;base64,${message.image}`} 
                    alt="Generated" 
                    className="rounded-md max-w-full h-auto"
                  />
                ) : (
                  <div className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-2">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex items-end space-x-2">
            <div className="flex-1 flex items-end space-x-2">
              <Textarea
                className="min-h-[60px] resize-none overflow-hidden"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageSelect}
              />
              <Button
                className="h-[60px] w-[60px]"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus className="h-4 w-4" />
              </Button>
              <Button 
                onClick={handleSendMessage} 
                disabled={isLoading}
                className="h-[60px] w-[60px] p-0"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {selectedImage && (
            <div className="flex items-center space-x-2">
              <div className="text-sm text-muted-foreground">
                Selected image: {selectedImage.name}
              </div>
              <Button
                className="text-sm"
                onClick={() => setSelectedImage(null)}
              >
                Remove
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}