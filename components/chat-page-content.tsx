"use client";

import { Suspense, useState } from 'react';
import ChatInterface from './chat-interface';
import { Button } from './ui/button';
import { HelpCircle, Settings, Plus, MessageSquare, Trash2, Menu } from 'lucide-react';
import { useChatStore } from '@/lib/stores/chat-store';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { SettingsDialog } from './settings-dialog';
import { HelpDialog } from './help-dialog';
import { ScrollArea } from './ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export function ChatPageContent() {
  const { chats, createChat, currentChatId, setCurrentChat, deleteChat } = useChatStore();
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const todayChats = chats.filter(
    chat => format(new Date(chat.lastUpdated), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  const olderChats = chats.filter(
    chat => format(new Date(chat.lastUpdated), 'yyyy-MM-dd') !== format(new Date(), 'yyyy-MM-dd')
  );

  const ChatItem = ({ chat, isActive }: { chat: typeof chats[0]; isActive: boolean }) => (
    <div
      className="group relative"
      onMouseEnter={() => setHoveredChatId(chat.id)}
      onMouseLeave={() => setHoveredChatId(null)}
    >
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start font-normal transition-all hover:bg-accent/50",
          isActive && "bg-accent/60 hover:bg-accent/60",
          "pl-2 pr-8"
        )}
        onClick={() => {
          setCurrentChat(chat.id);
          setSidebarOpen(false);
        }}
      >
        <MessageSquare className="mr-2 h-4 w-4" />
        <span className="truncate">{chat.title}</span>
      </Button>
      {hoveredChatId === chat.id && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            deleteChat(chat.id);
          }}
        >
          <Trash2 className="h-3 w-3 text-muted-foreground hover:text-red-500" />
        </Button>
      )}
    </div>
  );

  const Sidebar = () => (
    <div className="flex h-full flex-col gap-2">
      <div className="px-4 py-2">
        <Button 
          className="w-full justify-start"
          onClick={() => {
            createChat();
            setSidebarOpen(false);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>
      
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-4 py-2">
          {todayChats.length > 0 && (
            <div>
              <h2 className="px-2 text-lg font-semibold tracking-tight">Today</h2>
              <div className="mt-2 space-y-1">
                {todayChats.map(chat => (
                  <ChatItem 
                    key={chat.id} 
                    chat={chat} 
                    isActive={chat.id === currentChatId} 
                  />
                ))}
              </div>
            </div>
          )}
          
          {olderChats.length > 0 && (
            <div>
              <h2 className="px-2 text-lg font-semibold tracking-tight">Previous Chats</h2>
              <div className="mt-2 space-y-1">
                {olderChats.map(chat => (
                  <ChatItem 
                    key={chat.id} 
                    chat={chat} 
                    isActive={chat.id === currentChatId} 
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-2 space-y-1">
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => setShowHelp(true)}
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Help
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-40 md:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-[280px] p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-[280px] border-r">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse">Loading chat interface...</div>
          </div>
        }>
          <ChatInterface />
        </Suspense>
      </main>

      <SettingsDialog 
        open={showSettings} 
        onOpenChange={setShowSettings} 
      />
      
      <HelpDialog 
        open={showHelp} 
        onOpenChange={setShowHelp} 
      />
    </div>
  );
} 