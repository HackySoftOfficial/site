"use client";

import { Handle, Position, NodeProps } from 'reactflow';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useSettings } from '@/lib/stores/settings-store';

interface ChatInputData {
  onSend: (message: string) => void;
}

export function ChatInputNode({ data }: NodeProps<ChatInputData>) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { settings } = useSettings();

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;
    setIsLoading(true);
    await data.onSend(input);
    setInput('');
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-[400px] bg-background border rounded-lg shadow-lg p-4">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="space-y-2">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="min-h-[100px] resize-none"
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
        
        <div className="text-xs text-muted-foreground">
          Selected Model: {settings.model}
        </div>
      </div>
    </div>
  );
} 