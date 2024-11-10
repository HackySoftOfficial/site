import { Metadata } from 'next';
import { ChatInterface } from '@/components/chat-interface';

export const metadata: Metadata = {
  title: 'AI Chat - HackySoftX',
  description: 'Chat with our AI assistant for help with our tools and services',
};

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Chat with Our AI Assistant</h1>
          <p className="text-muted-foreground">
            Get instant help with our tools, services, or general inquiries
          </p>
        </div>
        <ChatInterface />
      </div>
    </div>
  );
} 