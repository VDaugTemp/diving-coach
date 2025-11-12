"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from "react";
import { ChatMessage, ChatSession } from "@/types";

const SESSIONS_KEY = "chat_sessions";

interface ChatHistoryContextType {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  getOrCreateSession: () => ChatSession;
  addMessage: (message: ChatMessage, sessionId?: string) => void;
  clearHistory: () => void;
  createSession: () => ChatSession;
}

const ChatHistoryContext = createContext<ChatHistoryContextType | undefined>(undefined);

export function ChatHistoryProvider({ 
  children, 
  sessionId 
}: { 
  children: ReactNode;
  sessionId: string | null;
}) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);

  // Load sessions from localStorage on mount
  useEffect(() => {
    try {
      const storedSessions = localStorage.getItem(SESSIONS_KEY);
      if (storedSessions) {
        const parsed = JSON.parse(storedSessions);
        // Validate that it's an array
        if (Array.isArray(parsed)) {
          setSessions(parsed);
        }
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
      // Clear corrupted data
      try {
        localStorage.removeItem(SESSIONS_KEY);
      } catch {
        // Ignore errors when clearing
      }
    }
  }, []);

  // Get current session - memoized to ensure React tracks changes properly
  const currentSession = useMemo((): ChatSession | null => {
    if (!sessionId) return null;
    return sessions.find((s) => s.id === sessionId) || null;
  }, [sessions, sessionId]);

  // Create a new session
  const createSession = useCallback((): ChatSession => {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setSessions((prev) => {
      const updated = [newSession, ...prev];
      try {
        localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Error saving session to localStorage:", error);
      }
      return updated;
    });

    return newSession;
  }, []);

  // Add message to a session
  const addMessage = useCallback(
    (message: ChatMessage, targetSessionId?: string) => {
      // Use provided sessionId or fall back to sessionId from URL
      const sessionIdToUse = targetSessionId || sessionId;
      
      if (!sessionIdToUse) {
        // No session ID available - this shouldn't happen in normal flow
        // but we'll create a session with the message
        const newSession: ChatSession = {
          id: crypto.randomUUID(),
          messages: [message],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        setSessions((prev) => {
          const updated = [newSession, ...prev];
          try {
            localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
          } catch (error) {
            console.error("Error saving to localStorage:", error);
          }
          return updated;
        });
        return;
      }
      
      setSessions((prev) => {
        // Check if session exists in the array
        const sessionExists = prev.some((s) => s.id === sessionIdToUse);
        
        if (!sessionExists) {
          // Session doesn't exist yet, create it with the message
          const newSession: ChatSession = {
            id: sessionIdToUse,
            messages: [message],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          const updated = [newSession, ...prev];
          try {
            localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
          } catch (error) {
            console.error("Error saving to localStorage:", error);
          }
          return updated;
        }

        // Session exists, add message to it
        const updated = prev.map((session) => {
          if (session.id === sessionIdToUse) {
            return {
              ...session,
              messages: [...session.messages, message],
              updatedAt: Date.now(),
            };
          }
          return session;
        });

        try {
          localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
        } catch (error) {
          console.error("Error saving to localStorage:", error);
        }
        return updated;
      });
    },
    [sessionId]
  );

  // Clear all history
  const clearHistory = useCallback(() => {
    setSessions([]);
    localStorage.removeItem(SESSIONS_KEY);
  }, []);

  // Get or create current session
  const getOrCreateSession = useCallback((): ChatSession => {
    if (currentSession) return currentSession;
    return createSession();
  }, [currentSession, createSession]);

  const value: ChatHistoryContextType = {
    sessions,
    currentSession,
    getOrCreateSession,
    addMessage,
    clearHistory,
    createSession,
  };

  return (
    <ChatHistoryContext.Provider value={value}>
      {children}
    </ChatHistoryContext.Provider>
  );
}

export function useChatHistory(sessionId: string | null = null) {
  const context = useContext(ChatHistoryContext);
  if (context === undefined) {
    throw new Error("useChatHistory must be used within a ChatHistoryProvider");
  }
  return context;
}

