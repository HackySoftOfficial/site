export type Role = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  role: Role;
  content: string;
  image?: string;
}

export interface ApiMessage {
  role: Role;
  content: string | Array<{ type: string; text?: string; image_url?: { url: string; details?: string } }>;
}

export interface ApiResponse {
  result: {
    response: string;
  };
  success: boolean;
  errors: string[];
  messages: string[];
} 