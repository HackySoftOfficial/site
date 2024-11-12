export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  image?: string;
}

export interface ImageResponse {
  result: {
    images: string[];
  };
  success: boolean;
  errors: string[];
  messages: string[];
} 