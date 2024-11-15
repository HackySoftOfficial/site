import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatMessage } from '@/lib/types';

export interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  lastUpdated: Date;
}

interface ChatStore {
  chats: Chat[];
  currentChatId: string | null;
  createChat: () => void;
  updateChat: (chatId: string, messages: ChatMessage[], title?: string) => void;
  setCurrentChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      chats: [],
      currentChatId: null,
      createChat: () => {
        const newChat: Chat = {
          id: crypto.randomUUID(),
          title: 'New Chat',
          messages: [],
          createdAt: new Date(),
          lastUpdated: new Date(),
        };
        set(state => ({
          chats: [newChat, ...state.chats],
          currentChatId: newChat.id,
        }));
      },
      updateChat: (chatId, messages, title) => {
        set(state => ({
          chats: state.chats.map(chat => 
            chat.id === chatId 
              ? { 
                  ...chat, 
                  messages,
                  lastUpdated: new Date(),
                  title: title || chat.title,
                }
              : chat
          ),
        }));
      },
      setCurrentChat: (chatId) => {
        set({ currentChatId: chatId });
      },
      deleteChat: (chatId) => {
        set(state => ({
          chats: state.chats.filter(chat => chat.id !== chatId),
          currentChatId: state.currentChatId === chatId ? null : state.currentChatId,
        }));
      },
    }),
    {
      name: 'chat-storage',
    }
  )
); 