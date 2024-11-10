"use client";

import { Suspense } from 'react';
import ChatInterface from './chat-interface';

export function ChatPageContent() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Chat with Our AI Assistant</h1>
          <p className="text-muted-foreground">
            Get instant help with our tools, services, or general inquiries
          </p>
        </div>
        <Suspense fallback={
          <div className="flex items-center justify-center h-[70vh]">
            <div className="animate-pulse">Loading chat interface...</div>
          </div>
        }>
          <ChatInterface />
        </Suspense>
      </div>
    </div>
  );
} 