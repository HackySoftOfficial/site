"use client";

import { Handle, Position, NodeProps } from 'reactflow';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface ChatOutputData {
  messages: Array<{
    role: 'assistant' | 'user';
    content: string;
  }>;
  isLoading?: boolean;
}

export function ChatOutputNode({ data }: NodeProps<ChatOutputData>) {
  return (
    <div className="w-[400px] bg-background border rounded-lg shadow-lg">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <ScrollArea className="h-[300px] p-4">
        <div className="space-y-4">
          {data.messages.map((message, i) => (
            <div
              key={i}
              className={cn(
                "flex w-full",
                message.role === 'assistant' ? 'justify-start' : 'justify-end'
              )}
            >
              <div
                className={cn(
                  "rounded-lg px-4 py-2 max-w-[90%]",
                  message.role === 'assistant' 
                    ? "bg-muted" 
                    : "bg-primary text-primary-foreground"
                )}
              >
                {message.content}
              </div>
            </div>
          ))}
          
          {data.isLoading && (
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
    </div>
  );
} 