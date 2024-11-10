"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { useChat } from 'ai/react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const AI_MODELS = [
  {
    id: 'hf:mistralai/Mixtral-8x7B-Instruct-v0.1',
    name: 'Mixtral 8x7B',
    description: 'Powerful open-source model with strong reasoning capabilities',
    tokens: '8x7B parameters',
    provider: 'glhf'
  },
  {
    id: 'hf:mistralai/Mistral-7B-Instruct-v0.2',
    name: 'Mistral 7B',
    description: 'Efficient and capable instruction-following model',
    tokens: '7B parameters',
    provider: 'glhf'
  },
  {
    id: 'hf:openchat/openchat-3.5',
    name: 'OpenChat 3.5',
    description: 'Open-source chatbot with strong conversational abilities',
    tokens: '7B parameters',
    provider: 'glhf'
  },
  {
    id: 'hf:NousResearch/Nous-Hermes-2-Yi-34b',
    name: 'Nous Hermes 2',
    description: 'Large language model optimized for helpful interactions',
    tokens: '34B parameters',
    provider: 'glhf'
  },
  {
    id: 'Meta-Llama-3.1-405B-Instruct',
    name: 'Llama 3.1 405B',
    description: 'Meta\'s largest model optimized for multilingual dialogue',
    tokens: '405B parameters',
    provider: 'github'
  },
  {
    id: 'Meta-Llama-3.1-70B-Instruct',
    name: 'Llama 3.1 70B',
    description: 'Powerful model for reasoning and dialogue',
    tokens: '70B parameters',
    provider: 'github'
  },
  {
    id: 'Meta-Llama-3.1-8B-Instruct',
    name: 'Llama 3.1 8B',
    description: 'Fast and efficient model for basic tasks',
    tokens: '8B parameters',
    provider: 'github'
  },
  {
    id: 'Mistral-large-2407',
    name: 'Mistral Large',
    description: 'Flagship model for complex reasoning and specialized tasks',
    tokens: 'Large parameters',
    provider: 'github'
  },
  {
    id: 'Phi-3-mini-4k-instruct',
    name: 'Phi-3 Medium',
    description: '14B parameter model with 128k context window',
    tokens: '14B parameters',
    provider: 'github'
  },
  {
    id: 'Phi-3-small-instruct-128k',
    name: 'Phi-3 Small',
    description: '7B parameter model with extended context',
    tokens: '7B parameters',
    provider: 'github'
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4',
    description: 'OpenAI\'s most advanced multimodal model for complex tasks',
    tokens: 'Latest GPT-4 architecture',
    provider: 'github'
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4 Mini',
    description: 'Affordable, efficient AI solution for diverse text tasks',
    tokens: 'Optimized GPT-4 architecture',
    provider: 'github'
  },
  {
    id: 'o1-mini',
    name: 'O1 Mini',
    description: 'Smaller, faster model optimized for code generation',
    tokens: 'Efficient architecture',
    provider: 'github'
  },
  {
    id: 'o1-preview',
    name: 'O1 Preview',
    description: 'Advanced reasoning and complex problem solving',
    tokens: 'Latest O1 architecture',
    provider: 'github'
  },
  {
    id: 'phi-3.5-mini-instruct-128k',
    name: 'Phi-3.5 Mini',
    description: 'Refresh of Phi-3-mini with 128k context window',
    tokens: 'Mini architecture',
    provider: 'github'
  },
  {
    id: 'phi-3.5-moe-instruct-128k',
    name: 'Phi-3.5 MoE',
    description: 'New mixture of experts model with 128k context',
    tokens: 'MoE architecture',
    provider: 'github'
  },
  {
    id: 'mistral-large-2407',
    name: 'Mistral Large',
    description: 'Advanced LLM with state-of-the-art reasoning capabilities',
    tokens: 'Large architecture',
    provider: 'github'
  },
  {
    id: 'mistral-small',
    name: 'Mistral Small',
    description: 'High efficiency and low latency model',
    tokens: 'Small architecture',
    provider: 'github'
  }
];

// Add system message to provide initial context
const SYSTEM_MESSAGE = {
  role: 'system' as const,
  content: 'You are a helpful assistant.'
};

export function ChatInterface() {
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]);

  const { messages, input, handleInputChange, handleSubmit, isLoading, reload } = useChat({
    api: '/api/chat',
    initialMessages: [{ ...SYSTEM_MESSAGE, id: 'system-message' }],
    body: {
      model: selectedModel.id,
      provider: selectedModel.provider,
    },
    onError: (error) => {
      console.error('Chat error:', error);
      setError('Failed to send message. Please try again later.');
      setTimeout(() => setError(null), 5000);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle model change with provider check
  const handleModelChange = (value: string) => {
    const newModel = AI_MODELS.find(m => m.id === value);
    if (newModel) {
      const isProviderChange = newModel.provider !== selectedModel.provider;
      setSelectedModel(newModel);
      
      // Clear chat history if switching providers
      if (isProviderChange) {
        reload();
      }
    }
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-3xl mx-auto p-4">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <Select 
          value={selectedModel.id} 
          onValueChange={handleModelChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="glhf" disabled className="font-semibold">
              GLHF.chat Models
            </SelectItem>
            {AI_MODELS.filter(m => m.provider === 'glhf').map((model) => (
              <HoverCard key={model.id}>
                <HoverCardTrigger asChild>
                  <SelectItem value={model.id} className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      <span>{model.name}</span>
                    </div>
                  </SelectItem>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium">{model.name}</h4>
                    <p className="text-sm text-muted-foreground">{model.description}</p>
                    <p className="text-sm font-mono">{model.tokens}</p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
            <SelectItem value="github" disabled className="font-semibold">
              GitHub Models
            </SelectItem>
            {AI_MODELS.filter(m => m.provider === 'github').map((model) => (
              <HoverCard key={model.id}>
                <HoverCardTrigger asChild>
                  <SelectItem value={model.id} className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      <span>{model.name}</span>
                    </div>
                  </SelectItem>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium">{model.name}</h4>
                    <p className="text-sm text-muted-foreground">{model.description}</p>
                    <p className="text-sm font-mono">{model.tokens}</p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="flex-1 overflow-y-auto p-4 mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </Card>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="flex-1"
          rows={1}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
} 