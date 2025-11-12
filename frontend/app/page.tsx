"use client";

import { Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import ChatInterface, { ChatInterfaceRef } from "@/components/ChatInterface";
import PresetSelector from "@/components/PresetSelector";
import Header from "@/components/Header";
import ChatHistorySidebar from "@/components/ChatHistorySidebar";
import { useChatHistory } from "@/contexts/ChatHistoryContext";
import { useThemeStyles } from "@/hooks/useThemeStyles";

function HomeContent() {
  const { currentSession } = useChatHistory();
  const styles = useThemeStyles();
  const chatInterfaceRef = useRef<ChatInterfaceRef>(null);

  // Check if there are any messages in the current session
  // Show prompts when:
  // 1. No session is selected (currentSession is null), OR
  // 2. Current session exists but has no messages (new/empty conversation)
  const hasMessages = currentSession
    ? currentSession.messages.length > 0
    : false;
  const showPrompts = !hasMessages;

  const handlePromptSelect = (prompt: string) => {
    // Always send the message immediately when a prompt is selected
    if (chatInterfaceRef.current) {
      chatInterfaceRef.current.sendMessage(prompt);
    }
  };

  return (
    <motion.div
      className="flex flex-col h-screen"
      style={{ backgroundColor: styles.bg }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <Header />

      {/* Main Content with Sidebar */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Chat History Sidebar */}
        <ChatHistorySidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {showPrompts ? (
            /* Show prompts full screen when no messages sent */
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-hidden">
                <PresetSelector onSelect={handlePromptSelect} />
              </div>
              {/* Input area for sending selected prompt */}
              <div
                className="border-t p-4"
                style={{
                  backgroundColor: styles.surface,
                  borderColor: styles.border,
                }}
              >
                <ChatInterface ref={chatInterfaceRef} showInputOnly={true} />
              </div>
            </div>
          ) : (
            /* Show full chat interface when messages exist */
            <div className="flex-1 overflow-hidden">
              <ChatInterface ref={chatInterfaceRef} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg">Loading...</div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
