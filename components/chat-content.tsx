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

interface ApiResponse {
  result: {
    response: string;
  };
}

export default function ChatContent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: 'You are a helpful and knowledgeable assistant focused on providing accurate, ethical information and technical guidance. You aim to be direct and clear while maintaining professional boundaries and safety guidelines.',
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
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data: ApiResponse = await response.json();
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
      <ScrollArea ref={scrollRef} className="flex-1 px-4">
        <div className="max-w-3xl mx-auto py-6 space-y-6">
          {messages.slice(1).map((message, index) => (
            <div 
              key={index} 
              className={cn(
                'group flex gap-3 text-sm text-foreground',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div className={cn(
                'flex gap-3 max-w-[85%]',
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              )}>
                <Avatar className={cn(
                  "h-8 w-8 border-2 shadow-sm",
                  message.role === 'assistant' ? "border-primary/20" : "border-primary/40"
                )}>
                  {message.role === 'assistant' ? (
                    <Bot className="h-4 w-4 text-primary" />
                  ) : (
                    <User className="h-4 w-4 text-primary" />
                  )}
                </Avatar>
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2 shadow-sm",
                    message.role === 'user' 
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start gap-3 text-sm text-foreground">
              <div className="flex gap-3 max-w-[85%]">
                <Avatar className="h-8 w-8 border-2 border-primary/20 shadow-sm">
                  <Bot className="h-4 w-4 text-primary" />
                </Avatar>
                <div className="rounded-2xl px-4 py-2 bg-muted shadow-sm min-w-[60px] flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <div className="max-w-3xl mx-auto flex items-end space-x-2">
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
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading}
            size="icon"
            className="h-[60px] w-[60px]"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 