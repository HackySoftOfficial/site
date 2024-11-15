import { Metadata } from 'next';
import { ChatPageContent } from '@/components/chat-page-content';

export const metadata: Metadata = {
  title: 'AI Chat - HackySoftX',
  description: 'Chat with our AI assistant for help with our tools and services',
};

export default function ChatPage() {
  return <ChatPageContent />;
} 