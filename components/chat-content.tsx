"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2, Bot, User } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

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
}

interface Props {
  hcaptchaToken: string;
}

export default function ChatContent({ hcaptchaToken }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: 'You are a aggresive assistant that helps users with technical questions.',
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = { role: 'user', content: inputValue.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          token: hcaptchaToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json() as CloudflareAIResponse;
      
      if (!data.success || data.errors?.length > 0) {
        throw new Error(data.errors?.[0] || 'Failed to get AI response');
      }

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
    <>
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.slice(1).map((message, index) => (
          <div 
            key={index} 
            className={cn(
              'flex gap-3 max-w-[85%] mb-4',
              message.role === 'user' ? 'ml-auto' : 'mr-auto'
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
      </ScrollArea>

      <div className="border-t p-4 bg-background">
        <div className="flex items-center space-x-2">
          <Textarea
            className="min-h-[60px] flex-1"
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
          <Button onClick={handleSendMessage} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </>
  );
} 