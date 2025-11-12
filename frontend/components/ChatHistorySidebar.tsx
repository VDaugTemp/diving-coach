"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useChatHistory } from "@/contexts/ChatHistoryContext";
import { useThemeStyles } from "@/hooks/useThemeStyles";
import { ChatSession } from "@/types";

export default function ChatHistorySidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSessionId = searchParams.get("session");
  const { sessions, createSession } = useChatHistory();
  const styles = useThemeStyles();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleNewConversation = () => {
    const newSession = createSession();
    // Navigate to new session URL
    router.push(`/?session=${newSession.id}`);
  };

  const handleSessionSelect = (sessionId: string) => {
    // Navigate to selected session URL
    router.push(`/?session=${sessionId}`);
  };

  // Get a display title for a session
  const getSessionTitle = (session: ChatSession): string => {
    if (session.messages.length === 0) {
      return "New Conversation";
    }
    // Use first user message as title, truncated
    const firstUserMessage = session.messages.find((msg) => msg.role === "user");
    if (firstUserMessage) {
      const title = firstUserMessage.content.substring(0, 50);
      return title.length < firstUserMessage.content.length ? title + "..." : title;
    }
    return "Conversation";
  };

  // Format date for display
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <>
      {/* Collapsed button - always visible */}
      {!isOpen && (
        <motion.button
          onClick={handleToggle}
          className="fixed left-0 top-24 z-50 p-2 rounded-r-lg transition-all duration-200"
          style={{
            backgroundColor: styles.surface,
            borderTop: `1px solid ${styles.border}`,
            borderRight: `1px solid ${styles.border}`,
            borderBottom: `1px solid ${styles.border}`,
            borderLeft: "none",
            color: styles.text,
          }}
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Open chat history"
        >
          <span className="text-xl">→</span>
        </motion.button>
      )}

      {/* Sidebar panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed left-0 top-24 bottom-0 z-40 w-64 flex flex-col"
            style={{
              backgroundColor: styles.surface,
              borderRight: `1px solid ${styles.border}`,
            }}
          >
            {/* Header */}
            <div
              className="p-4 border-b flex items-center justify-between"
              style={{ borderColor: styles.border }}
            >
              <h2
                className="text-lg font-semibold"
                style={{ color: styles.text, fontFamily: styles.fontFamily }}
              >
                Chat History
              </h2>
              <motion.button
                onClick={handleToggle}
                className="p-1 rounded transition-colors"
                style={{
                  color: styles.text,
                  backgroundColor: "transparent",
                }}
                whileHover={{ backgroundColor: styles.hoverBg }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close chat history"
              >
                <span className="text-xl">←</span>
              </motion.button>
            </div>

            {/* New Conversation Button */}
            <div className="p-4 border-b" style={{ borderColor: styles.border }}>
              <motion.button
                onClick={handleNewConversation}
                className="w-full p-3 rounded-lg text-left transition-all duration-200"
                style={{
                  backgroundColor: styles.primary,
                  color: styles.buttonText,
                  fontFamily: styles.fontFamily,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="font-medium">+ New Conversation</span>
              </motion.button>
            </div>

            {/* Sessions List */}
            <div className="flex-1 overflow-y-auto p-2">
              {sessions.length === 0 ? (
                <div
                  className="p-4 text-center text-sm"
                  style={{ color: styles.textSecondary }}
                >
                  No previous conversations
                </div>
              ) : (
                <div className="space-y-1">
                  {sessions.map((session) => {
                    const isActive = currentSessionId === session.id;
                    return (
                      <motion.button
                        key={`${session.id}-${session.messages.length}-${session.updatedAt}`}
                        onClick={() => handleSessionSelect(session.id)}
                        className="w-full text-left p-3 rounded-lg transition-all duration-200"
                        style={{
                          backgroundColor: isActive
                            ? styles.primary
                            : styles.cardBg,
                          color: isActive ? styles.buttonText : styles.text,
                          border: `1px solid ${isActive ? styles.primary : styles.border}`,
                          fontFamily: styles.fontFamily,
                        }}
                        whileHover={{
                          scale: 1.02,
                          backgroundColor: isActive ? styles.primary : styles.hoverBg,
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium truncate">
                            {getSessionTitle(session)}
                          </p>
                          <div className="flex items-center justify-between text-xs opacity-70">
                            <span>{formatDate(session.updatedAt)}</span>
                            <span>{session.messages.length} messages</span>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay when sidebar is open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleToggle}
            className="fixed inset-0 bg-black bg-opacity-20 z-30"
          />
        )}
      </AnimatePresence>
    </>
  );
}

