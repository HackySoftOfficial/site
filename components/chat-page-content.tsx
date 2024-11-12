"use client";

import { Suspense } from 'react';
import { ModelSelectorFlow } from './flow/model-selector-flow';

export function ChatPageContent() {
  return (
    <div className="h-[calc(100vh-3.5rem)]">
      <Suspense fallback={
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse">Loading flow interface...</div>
        </div>
      }>
        <ModelSelectorFlow />
      </Suspense>
    </div>
  );
} 