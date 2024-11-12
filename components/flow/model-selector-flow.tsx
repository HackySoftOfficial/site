"use client";

import { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  NodeTypes,
  ConnectionMode,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from 'reactflow';
import { ModelNode } from './model-node';
import { ChatInputNode } from './chat-input-node';
import { ChatOutputNode } from './chat-output-node';
import { HistoryNode } from './history-node';
import { ChatHistoryNode } from './chat-history-node';
import { useSettings } from '@/lib/stores/settings-store';
import type { ChatMessage } from '@/lib/types';
import 'reactflow/dist/style.css';
import { useChatStore, Chat } from '@/lib/stores/chat-store';
import { nanoid } from 'nanoid';

type NodeData = {
  label: string;
  model?: string;
  provider: 'github' | 'cloudflare' | 'history';
  description: string;
  isSelected?: boolean;
  onSend?: (message: string) => Promise<void>;
  messages?: ChatMessage[];
  isLoading?: boolean;
  chatId?: string;
  chats?: Chat[];
};

type CustomNode = Node<NodeData>;

const nodeTypes = {
  model: ModelNode,
  chatInput: ChatInputNode,
  chatOutput: ChatOutputNode,
  history: HistoryNode,
  chatHistory: ChatHistoryNode,
} as const;

const modelNodes: CustomNode[] = [
  {
    id: 'start',
    type: 'model',
    position: { x: 400, y: 100 },
    data: {
      label: 'GPT-4',
      model: 'gpt-4o',
      provider: 'github',
      description: 'Most capable model, best for complex tasks and detailed analysis.',
    },
  },
  {
    id: 'gpt4-mini',
    type: 'model',
    position: { x: 400, y: 300 },
    data: {
      label: 'GPT-4 Mini',
      model: 'gpt-4o-mini',
      provider: 'github',
      description: 'Balanced performance and speed for general-purpose use.',
    },
  },
  {
    id: 'llama',
    type: 'model',
    position: { x: 100, y: 300 },
    data: {
      label: 'LLaMA-2 7B',
      model: '@cf/meta/llama-2-7b-chat-int8',
      provider: 'cloudflare',
      description: 'Open-source model optimized for chat applications.',
    },
  },
  {
    id: 'mistral',
    type: 'model',
    position: { x: 700, y: 300 },
    data: {
      label: 'Mistral 7B',
      model: '@cf/mistral/mistral-7b-instruct-v0.1',
      provider: 'cloudflare',
      description: 'Efficient model with strong reasoning capabilities.',
    },
  },
  {
    id: 'history',
    type: 'history',
    position: { x: 400, y: 500 },
    data: {
      label: 'Chat History',
      provider: 'history',
      description: 'View past conversations and model interactions.',
    },
  },
];

const chatNodes: CustomNode[] = [
  {
    id: 'input',
    type: 'chatInput',
    position: { x: 400, y: 700 },
    data: {
      label: 'Chat Input',
      provider: 'github',
      description: 'Type your message here',
      onSend: async () => {},
    },
  },
  {
    id: 'output',
    type: 'chatOutput',
    position: { x: 400, y: 900 },
    data: {
      label: 'Chat Output',
      provider: 'github',
      description: 'Chat responses appear here',
      messages: [],
      isLoading: false,
    },
  },
];

const allInitialNodes: CustomNode[] = [...modelNodes, ...chatNodes];

const initialEdges: Edge[] = [
  { 
    id: 'e1', 
    source: 'start', 
    target: 'gpt4-mini',
    animated: true,
    style: { stroke: 'hsl(var(--primary))' },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  { 
    id: 'e2', 
    source: 'start', 
    target: 'llama',
    animated: true,
    style: { stroke: 'hsl(var(--primary))' },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  { 
    id: 'e3', 
    source: 'start', 
    target: 'mistral',
    animated: true,
    style: { stroke: 'hsl(var(--primary))' },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  { 
    id: 'e4', 
    source: 'gpt4-mini', 
    target: 'input',
    animated: true,
    style: { stroke: 'hsl(var(--primary))' },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  { 
    id: 'e5', 
    source: 'llama', 
    target: 'input',
    animated: true,
    style: { stroke: 'hsl(var(--primary))' },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  { 
    id: 'e6', 
    source: 'mistral', 
    target: 'input',
    animated: true,
    style: { stroke: 'hsl(var(--primary))' },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
];

export function ModelSelectorFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(allInitialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { settings } = useSettings();
  const isDevelopment = process.env.NODE_ENV === 'development';
  const { createChat, updateChat, currentChatId, chats } = useChatStore();

  // Create a new chat when component mounts
  useEffect(() => {
    if (!currentChatId) {
      createChat();
    }
  }, [currentChatId, createChat]);

  // Move handleSendMessage into useCallback
  const handleSendMessage = useCallback(async (message: string) => {
    try {
      const newMessage: ChatMessage = {
        role: 'user',
        content: message,
      };

      setNodes((nds: CustomNode[]) =>
        nds.map((node) => {
          if (node.id === 'output') {
            const updatedNode = {
              ...node,
              data: {
                ...node.data,
                messages: [...(node.data.messages || []), newMessage],
                isLoading: true,
              },
            };
            return updatedNode as CustomNode;
          }
          return node;
        })
      );

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, newMessage],
          model: settings.model,
          provider: settings.provider,
          type: 'text',
          token: isDevelopment ? 'development' : 'verified'
        }),
      });

      const data = await response.json() as { errors?: string[]; result: { response: string } };

      if (!response.ok) {
        throw new Error(data.errors?.[0] || 'Failed to send message');
      }

      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: data.result.response,
      };

      const updatedMessages = [...messages, newMessage, aiMessage];
      setMessages(updatedMessages);

      if (currentChatId) {
        updateChat(currentChatId, updatedMessages, message.slice(0, 30) + '...');
      }

      setNodes((nds: CustomNode[]) =>
        nds.map((node) => {
          if (node.id === 'output') {
            const updatedNode = {
              ...node,
              data: {
                ...node.data,
                messages: updatedMessages,
                isLoading: false,
              },
            };
            return updatedNode as CustomNode;
          }
          return node;
        })
      );

    } catch (error) {
      console.error('Failed to send message:', error);
      setNodes((nds: CustomNode[]) =>
        nds.map((node) => {
          if (node.id === 'output') {
            const updatedNode = {
              ...node,
              data: {
                ...node.data,
                isLoading: false,
              },
            };
            return updatedNode as CustomNode;
          }
          return node;
        })
      );
    }
  }, [messages, settings, currentChatId, updateChat, setNodes, isDevelopment]);

  // Update input node's onSend handler
  useEffect(() => {
    const handleMessageSend = handleSendMessage;
    setNodes((nds: CustomNode[]) =>
      nds.map((node) => {
        if (node.id === 'input') {
          const updatedNode = {
            ...node,
            data: {
              ...node.data,
              onSend: handleMessageSend,
            },
          };
          return updatedNode as CustomNode;
        }
        return node;
      })
    );
  }, [messages, settings, handleSendMessage, setNodes]);

  const onConnect = useCallback((params: any) => {
    setEdges((eds) => addEdge({
      ...params,
      animated: true,
      style: { stroke: 'hsl(var(--primary))' },
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    }, eds));
  }, [setEdges]);

  useEffect(() => {
    const handleAddNode = (event: CustomEvent<CustomNode>) => {
      setNodes((nds) => [...nds, event.detail]);
    };

    const handleRemoveNode = (event: CustomEvent<{ id: string }>) => {
      setNodes((nds) => nds.filter((node) => node.id !== event.detail.id));
    };

    const handleCheckHistoryNode = () => {
      // Check if history node already exists
      const historyNodeExists = nodes.some(node => node.type === 'chatHistory');
      
      if (!historyNodeExists) {
        const newNode: CustomNode = {
          id: `history-${nanoid()}`,
          type: 'chatHistory',
          position: { x: 700, y: 500 },
          data: {
            label: 'Chat History',
            provider: 'history' as const,
            description: 'Past conversations',
            chats,
          },
        };
        setNodes((nds) => [...nds, newNode]);
      }
    };

    window.addEventListener('addNode', handleAddNode as EventListener);
    window.addEventListener('removeNode', handleRemoveNode as EventListener);
    window.addEventListener('checkHistoryNode', handleCheckHistoryNode as EventListener);

    return () => {
      window.removeEventListener('addNode', handleAddNode as EventListener);
      window.removeEventListener('removeNode', handleRemoveNode as EventListener);
      window.removeEventListener('checkHistoryNode', handleCheckHistoryNode as EventListener);
    };
  }, [setNodes, nodes, chats]);

  return (
    <div className="h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        attributionPosition="bottom-left"
        minZoom={0.5}
        maxZoom={1.5}
        className="bg-background"
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}