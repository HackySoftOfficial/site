"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useSettings } from '@/lib/stores/settings-store';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { settings, updateSettings } = useSettings();

  const models = {
    github: [
      { value: "gpt-4o", label: "GPT-4" },
      { value: "gpt-4o-mini", label: "GPT-4 Mini" },
    ],
    cloudflare: [
      { value: "@cf/meta/llama-2-7b-chat-int8", label: "LLaMA-2 7B" },
      { value: "@cf/mistral/mistral-7b-instruct-v0.1", label: "Mistral 7B" },
    ]
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Provider</Label>
            <Select
              value={settings.provider}
              onValueChange={(value: 'github' | 'cloudflare') => {
                updateSettings({ 
                  provider: value,
                  model: value === 'github' ? 'gpt-4o' : '@cf/meta/llama-2-7b-chat-int8'
                });
              }}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="github">GitHub Copilot</SelectItem>
                <SelectItem value="cloudflare">Cloudflare AI</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Model</Label>
            <Select
              value={settings.model}
              onValueChange={(value) => updateSettings({ model: value })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select AI model" />
              </SelectTrigger>
              <SelectContent>
                {models[settings.provider].map(model => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Notifications</Label>
            <Switch
              checked={settings.notifications}
              onCheckedChange={(checked) =>
                updateSettings({ notifications: checked })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Save History</Label>
            <Switch
              checked={settings.saveHistory}
              onCheckedChange={(checked) =>
                updateSettings({ saveHistory: checked })
              }
              className="col-span-3"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 