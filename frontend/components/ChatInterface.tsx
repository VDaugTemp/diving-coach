"use client";

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useChatHistory } from "@/contexts/ChatHistoryContext";
import { useThemeStyles } from "@/hooks/useThemeStyles";
import { streamChat } from "@/utils/api";
import { ChatMessage } from "@/types";
import BlobBackground from "./BlobBackground";

interface ChatInterfaceProps {
  showInputOnly?: boolean;
}

export interface ChatInterfaceRef {
  sendMessage: (message: string) => void;
}

const ChatInterface = forwardRef<ChatInterfaceRef, ChatInterfaceProps>(
  ({ showInputOnly = false }, ref) => {
  const router = useRouter();
  const { currentSession, addMessage, createSession } = useChatHistory();
  const styles = useThemeStyles();
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentResponse, setCurrentResponse] = useState("");
  const [sendButtonPulse, setSendButtonPulse] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const sendButtonRef = useRef<HTMLButtonElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const hasMessages = currentSession && currentSession.messages.length > 0;

  // Check if user is near the bottom of the scroll container
  const isNearBottom = (container: HTMLElement, threshold: number = 100): boolean => {
    const { scrollTop, scrollHeight, clientHeight } = container;
    return scrollHeight - scrollTop - clientHeight < threshold;
  };

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Handle scroll events to detect user scrolling
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;

    const nearBottom = isNearBottom(messagesContainerRef.current);
    setShouldAutoScroll(nearBottom);
    setShowScrollToBottom(!nearBottom && (currentSession?.messages.length ?? 0) > 0);

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Reset scroll state after scrolling stops
    scrollTimeoutRef.current = setTimeout(() => {
      // Timeout used to detect when scrolling stops
    }, 150);
  };

  // Handle scroll to bottom button click
  const handleScrollToBottomClick = () => {
    setShouldAutoScroll(true);
    scrollToBottom("smooth");
    setShowScrollToBottom(false);
  };

  // Auto-scroll to bottom only when appropriate
  useEffect(() => {
    // Always scroll to bottom on initial load or when session changes
    if (!currentSession?.messages.length) {
      scrollToBottom("auto");
      setShouldAutoScroll(true);
      setShowScrollToBottom(false);
      return;
    }

    // Only auto-scroll if user is at/near bottom or if it's a new message being streamed
    if (shouldAutoScroll || isStreaming) {
      // Use a small delay to ensure DOM has updated
      const timeoutId = setTimeout(() => {
        scrollToBottom("smooth");
        // Hide scroll button when we auto-scroll
        if (shouldAutoScroll) {
          setShowScrollToBottom(false);
        }
      }, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [currentSession?.messages.length, currentResponse, shouldAutoScroll, isStreaming]);

  // Reset scroll state when session changes
  useEffect(() => {
    setShouldAutoScroll(true);
    setShowScrollToBottom(false);
    // Scroll to bottom when session changes
    if (currentSession?.messages.length) {
      setTimeout(() => scrollToBottom("auto"), 100);
    }
  }, [currentSession?.id]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Extract send logic to reusable function
  const sendMessageInternal = async (messageContent: string) => {
    if (!messageContent.trim() || isStreaming) return;

    // Ensure we have a session before sending (create if needed)
    let activeSession = currentSession;
    if (!activeSession) {
      // If no session exists, create one and navigate to it
      activeSession = createSession();
      router.push(`/?session=${activeSession.id}`);
    }
    const targetSessionId = activeSession.id;

    const userMessage: ChatMessage = {
      role: "user",
      content: messageContent.trim(),
      timestamp: Date.now(),
    };

    addMessage(userMessage, targetSessionId);
    setInput("");
    setIsStreaming(true);
    setCurrentResponse("");
    // When user sends a message, always scroll to bottom
    setShouldAutoScroll(true);
    
    // Pulse send button animation
    setSendButtonPulse(true);
    setTimeout(() => setSendButtonPulse(false), 300);

    let assistantContent = "";

    await streamChat(
      {
        developer_message: "You are a helpful AI assistant.",
        user_message: messageContent.trim(),
      },
      (chunk) => {
        assistantContent += chunk;
        setCurrentResponse(assistantContent);
      },
      () => {
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: assistantContent,
          timestamp: Date.now(),
        };
        // Use the targetSessionId captured earlier to ensure message is added to correct session
        addMessage(assistantMessage, targetSessionId);
        setCurrentResponse("");
        setIsStreaming(false);
      },
      (error) => {
        console.error("Chat error:", error);
        const errorMessage: ChatMessage = {
          role: "assistant",
          content: `Error: ${error}`,
          timestamp: Date.now(),
        };
        // Use the targetSessionId captured earlier to ensure message is added to correct session
        addMessage(errorMessage, targetSessionId);
        setCurrentResponse("");
        setIsStreaming(false);
      }
    );
  };

  // Expose sendMessage via ref
  useImperativeHandle(ref, () => ({
    sendMessage: async (message: string) => {
      await sendMessageInternal(message);
    },
  }));

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;
    await sendMessageInternal(input);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // If showInputOnly is true and no messages, show only input
  if (showInputOnly && !hasMessages) {
    return (
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder=""
            className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 transition-all duration-200"
            style={{
              backgroundColor: styles.inputBg,
              borderColor: styles.border,
              color: styles.text,
              fontFamily: styles.fontFamily,
            }}
            rows={2}
            disabled={isStreaming}
          />
          {!input && (
            <div
              className={`absolute left-3 top-3 pointer-events-none transition-all duration-200 ${
                isFocused ? "text-xs -translate-y-2 opacity-70 animate-float" : "text-sm"
              }`}
              style={{ color: styles.textSecondary }}
            >
              Type your message or select a prompt above...
            </div>
          )}
        </div>
        <motion.button
          ref={sendButtonRef}
          onClick={handleSend}
          disabled={!input.trim() || isStreaming}
          className={`px-6 py-3 rounded-lg transition-colors ${
            sendButtonPulse ? "animate-pulse-once" : ""
          }`}
          style={{
            backgroundColor: styles.primary,
            color: styles.buttonText,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Send
        </motion.button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4 relative"
        style={{ backgroundColor: styles.bg }}
      >
        {/* Animated blob background */}
        <BlobBackground />
        {currentSession?.messages.map((msg) => (
          <motion.div
            key={`${msg.timestamp}-${msg.role}`}
            className={`flex relative z-10 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="max-w-[80%] rounded-lg p-3"
              style={{
                backgroundColor:
                  msg.role === "user" ? styles.messageUserBg : styles.messageBotBg,
                color:
                  msg.role === "user" ? styles.messageUserText : styles.messageBotText,
                border:
                  msg.role === "user"
                    ? "none"
                    : `1px solid ${styles.border}`,
                boxShadow:
                  msg.role === "user" ? styles.messageUserBoxShadow : "none",
              }}
            >
              <p className="whitespace-pre-wrap" style={{ fontFamily: styles.fontFamily }}>
                {msg.content}
              </p>
              <p className="text-xs mt-1" style={{ opacity: 0.7 }}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </motion.div>
        ))}

        {/* Streaming response */}
        {isStreaming && currentResponse && (
          <div className="flex justify-start relative z-10">
            <div
              className="max-w-[80%] rounded-lg p-3 border"
              style={{
                backgroundColor: styles.messageBotBg,
                color: styles.messageBotText,
                borderColor: styles.border,
                fontFamily: styles.fontFamily,
              }}
            >
              <p className="whitespace-pre-wrap">{currentResponse}</p>
              <span
                className="inline-block w-2 h-4 animate-pulse ml-1"
                style={{ backgroundColor: styles.primary }}
              />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} className="relative z-10" />

        {/* Scroll to bottom button - shows when user has scrolled up */}
        {showScrollToBottom && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleScrollToBottomClick}
            className="fixed bottom-28 right-8 z-20 p-3 rounded-full shadow-lg transition-all duration-200"
            style={{
              backgroundColor: styles.primary,
              color: styles.buttonText,
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Scroll to bottom"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.button>
        )}
      </div>

      {/* Input area */}
      <div
        className="border-t p-4"
        style={{
          backgroundColor: styles.surface,
          borderColor: styles.border,
        }}
      >
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder=""
              className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 transition-all duration-200"
              style={{
                backgroundColor: styles.inputBg,
                borderColor: styles.border,
                color: styles.text,
                fontFamily: styles.fontFamily,
              }}
              rows={2}
              disabled={isStreaming}
            />
            {!input && (
              <div
                className={`absolute left-3 top-3 pointer-events-none transition-all duration-200 ${
                  isFocused ? "text-xs -translate-y-2 opacity-70 animate-float" : "text-sm"
                }`}
                style={{ color: styles.textSecondary }}
              >
                Type your message...
              </div>
            )}
          </div>
          <motion.button
            ref={sendButtonRef}
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className={`px-6 py-3 rounded-lg transition-colors ${
              sendButtonPulse ? "animate-pulse-once" : ""
            }`}
            style={{
              backgroundColor: styles.primary,
              color: styles.buttonText,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Send
          </motion.button>
        </div>
      </div>
    </div>
  );
});

ChatInterface.displayName = "ChatInterface";

export default ChatInterface;

