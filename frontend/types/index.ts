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
  // Engagement metrics
  totalMessages: number;
  totalSessions: number;
  avgMessagesPerSession: number;
  avgSessionDuration: number; // in minutes
  
  // Content metrics
  avgWordCount: number;
  avgResponseLength: number; // average word count of assistant messages
  
  // Activity metrics
  messagesOverTime: Array<{ date: string; count: number }>; // messages grouped by day
  mostActiveHour: number; // hour of day (0-23) with most messages
  mostActiveDay: string; // day of week with most messages
}

export interface RAGStats {
  // Vector store information
  vector_store: {
    num_documents: number;
    embedding_dimension: number | null;
    total_size_mb: number;
  };
  
  // Retrieval quality metrics
  total_queries: number;
  total_documents_retrieved: number;
  avg_documents_per_query: number;
  avg_relevance_score: number;
  
  // Usage patterns
  similarity_method_usage: {
    cosine: number;
    euclidean: number;
  };
  top_sources: Array<{
    source: string;
    count: number;
  }>;
  
  // Recent activity
  recent_queries: Array<{
    timestamp: string;
    num_results: number;
  }>;
}

