"use client";

import { Handle, Position, NodeProps } from 'reactflow';
import { History } from 'lucide-react';
import { useChatStore } from '@/lib/stores/chat-store';

interface HistoryNodeData {
  label: string;
  provider: 'history';
  description: string;
}

export function HistoryNode({ data }: NodeProps<HistoryNodeData>) {
  const { chats } = useChatStore();

  const onDragStart = (event: React.DragEvent) => {
    // Create a custom event when dragging starts
    const dragEvent = new CustomEvent('checkHistoryNode', {
      detail: { isDragging: true }
    });
    window.dispatchEvent(dragEvent);
  };

  return (
    <div 
      className="p-4 rounded-lg border bg-background shadow-lg w-[280px] hover:shadow-xl transition-shadow cursor-grab active:cursor-grabbing"
      draggable
      onDragStart={onDragStart}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-primary" />
              <h3 className="font-medium">{data.label}</h3>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          {data.description}
        </p>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
} 