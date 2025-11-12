/**
 * Type definitions for the chat application
 */

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export interface Metrics {
  avgResponseTime: number; // in milliseconds
  avgWordCount: number;
  sentimentTrend: "positive" | "neutral" | "negative";
  totalMessages: number;
  totalSessions: number;
}

