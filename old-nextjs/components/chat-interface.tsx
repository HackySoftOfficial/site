"use client";

import { useState, useEffect } from 'react';
import { useChatStore } from '@/lib/stores/chat-store';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { ImagePlus, Send } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';
import { useSettings } from '@/lib/stores/settings-store';
import type { ChatMessage, ApiResponse } from '@/lib/types';

export default function ChatInterface() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { settings } = useSettings();
  const { chats, currentChatId, updateChat } = useChatStore();
  const currentChat = chats.find(chat => chat.id === currentChatId);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const newMessage: ChatMessage = {
      role: 'user',
      content: input,
    };

    // Update chat with user message immediately
    const updatedMessages = [...(currentChat?.messages || []), newMessage];
    updateChat(currentChatId!, updatedMessages);
    setInput('');

    try {
      setIsLoading(true);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages,
          model: settings.model,
          provider: settings.provider,
          type: 'text',
        }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.errors?.[0] || 'Failed to send message');
      }

      // Add AI response to chat
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: data.result.response,
      };

      updateChat(
        currentChatId!, 
        [...updatedMessages, aiMessage],
        input.slice(0, 30) + '...'
      );

    } catch (error) {
      console.error('Failed to send message:', error);
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

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {currentChat?.messages.map((message, i) => (
            <div
              key={i}
              className={cn(
                "flex w-full",
                message.role === 'assistant' ? 'justify-start' : 'justify-end'
              )}
            >
              <div
                className={cn(
                  "rounded-lg px-4 py-2 max-w-[80%]",
                  message.role === 'assistant' 
                    ? "bg-muted" 
                    : "bg-primary text-primary-foreground"
                )}
              >
                {message.content}
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

      <div className="border-t bg-background p-4">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            className="shrink-0"
          >
            <ImagePlus className="h-4 w-4" />
          </Button>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="min-h-[44px] resize-none"
            rows={1}
          />
          <Button 
            className="shrink-0" 
            size="icon"
            disabled={isLoading || !input.trim()}
            onClick={handleSubmit}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}