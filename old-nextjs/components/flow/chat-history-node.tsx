"use client";

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ChatMessage } from '@/lib/types';

interface ChatHistoryNodeData {
  label: string;
  description: string;
  messages?: ChatMessage[];
  isSelected?: boolean;
}

function ChatHistoryNodeComponent({ data, isConnectable }: NodeProps<ChatHistoryNodeData>) {
  return (
    <Card className={`w-[300px] shadow-md transition-colors ${
      data.isSelected ? 'border-primary' : 'border-border'
    }`}>
      <CardHeader className="p-4">
        <CardTitle className="text-sm font-medium">{data.label}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-xs text-muted-foreground mb-4">{data.description}</p>
        <ScrollArea className="h-[200px] w-full rounded-md border p-2">
          {data.messages?.map((message, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-muted ml-4' 
                  : 'bg-primary/10 mr-4'
              }`}
            >
              <p className="text-xs">
                {message.role === 'user' ? '👤' : '🤖'} {message.content}
              </p>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-primary"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-primary"
      />
    </Card>
  );
}

ChatHistoryNodeComponent.displayName = 'ChatHistoryNode';

export const ChatHistoryNode = memo(ChatHistoryNodeComponent);