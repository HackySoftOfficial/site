import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Settings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  saveHistory: boolean;
  model: string;
  provider: 'github' | 'cloudflare';
}

interface SettingsStore {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
}

export const useSettings = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: {
        theme: 'system',
        notifications: true,
        saveHistory: true,
        model: 'gpt-4o',
        provider: 'github'
      },
      updateSettings: (newSettings) => 
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        })),
    }),
    {
      name: 'settings-storage',
    }
  )
); 