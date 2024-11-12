"use client";

import { Handle, Position, NodeProps } from 'reactflow';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSettings } from '@/lib/stores/settings-store';
import { Bot, Cpu, BarChart3, Settings, History } from 'lucide-react';

interface ModelNodeData {
  label: string;
  model?: string;
  provider: 'github' | 'cloudflare' | 'stats' | 'settings' | 'history';
  description: string;
  isSelected?: boolean;
}

export function ModelNode({ data }: NodeProps<ModelNodeData>) {
  const { settings, updateSettings } = useSettings();
  const isActive = data.model && settings.model === data.model && settings.provider === data.provider;

  const handleSelect = () => {
    if (data.model) {
      updateSettings({
        model: data.model,
        provider: data.provider as 'github' | 'cloudflare'
      });
    }
  };

  const getIcon = () => {
    switch (data.provider) {
      case 'github':
        return <Bot className="w-4 h-4 text-primary" />;
      case 'cloudflare':
        return <Cpu className="w-4 h-4 text-primary" />;
      case 'stats':
        return <BarChart3 className="w-4 h-4 text-primary" />;
      case 'settings':
        return <Settings className="w-4 h-4 text-primary" />;
      case 'history':
        return <History className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className={`
      p-4 rounded-lg border bg-background shadow-lg
      ${isActive ? 'ring-2 ring-primary' : ''}
      w-[280px]
      hover:shadow-xl transition-shadow
    `}>
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {getIcon()}
              <h3 className="font-medium">{data.label}</h3>
            </div>
            <Badge variant="secondary" className="capitalize">
              {data.provider}
            </Badge>
          </div>
          {data.model && (
            <Button 
              size="sm" 
              variant={isActive ? "default" : "outline"}
              onClick={handleSelect}
            >
              {isActive ? 'Selected' : 'Select'}
            </Button>
          )}
        </div>

        <p className="text-sm text-muted-foreground">
          {data.description}
        </p>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
} 