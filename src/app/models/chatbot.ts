import { Maybe } from './types';

export type MessageRole = 'assistant' | 'user';

export interface ChatbotIcons {
  agent: string;
  user: string;
}

export interface ChatMessage {
  role: MessageRole;
  content: string;
}

export interface SendMessageData {
  question: string;
  conversationHistory?: ChatMessage[];
  category?: Maybe<string>;
}
