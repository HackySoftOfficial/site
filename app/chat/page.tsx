import { ChatInterface } from '@/components/chat-interface';

export default function ChatPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Chat</h1>
        <p className="text-muted-foreground">
          Chat with various AI models powered by glhf.chat
        </p>
      </div>
      <ChatInterface />
    </div>
  );
} 