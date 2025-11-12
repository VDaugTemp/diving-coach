"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useChatHistory } from "@/contexts/ChatHistoryContext";
import { usePresets } from "@/hooks/usePresets";
import MetricsDashboard from "@/components/MetricsDashboard";
import Header from "@/components/Header";
import { useThemeStyles } from "@/hooks/useThemeStyles";

export default function SettingsPage() {
  const { clearHistory } = useChatHistory();
  const { resetToDefault } = usePresets();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const styles = useThemeStyles();

  const handleClearHistory = () => {
    clearHistory();
    setShowClearConfirm(false);
    setSuccessMessage("Chat history cleared successfully!");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleResetPresets = () => {
    resetToDefault();
    setShowResetConfirm(false);
    setSuccessMessage("Presets reset to default successfully!");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <motion.div
      className="min-h-screen"
      style={{ backgroundColor: styles.bg }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <Header />

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Success Message */}
        {successMessage && (
          <motion.div
            className="px-4 py-3 rounded-lg border"
            style={{
              backgroundColor: styles.surface,
              borderColor: styles.border,
              color: styles.text,
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {successMessage}
          </motion.div>
        )}

        {/* Metrics Dashboard */}
        <MetricsDashboard />

        {/* Chat History Section */}
        <motion.div
          className="rounded-lg border p-6"
          style={{
            backgroundColor: styles.surface,
            borderColor: styles.border,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2
            className="text-xl font-bold mb-4 gradient-text"
            style={{ fontFamily: styles.fontFamily }}
          >
            Chat History
          </h2>
          <p style={{ color: styles.textSecondary, marginBottom: "1rem" }}>
            Clear all your chat history. This action cannot be undone.
          </p>
          {showClearConfirm ? (
            <div className="flex gap-2">
              <button
                onClick={handleClearHistory}
                className="px-4 py-2 rounded-lg transition-colors text-white"
                style={{ backgroundColor: "#ef4444" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#dc2626";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ef4444";
                }}
              >
                Confirm Clear
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: styles.hoverBg,
                  color: styles.text,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = styles.border;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = styles.hoverBg;
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-4 py-2 rounded-lg transition-colors text-white"
              style={{ backgroundColor: "#ef4444" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#dc2626";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#ef4444";
              }}
            >
              Clear History
            </button>
          )}
        </motion.div>

        {/* Presets Section */}
        <motion.div
          className="rounded-lg border p-6"
          style={{
            backgroundColor: styles.surface,
            borderColor: styles.border,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2
            className="text-xl font-bold mb-4 gradient-text"
            style={{ fontFamily: styles.fontFamily }}
          >
            Preset Prompts
          </h2>
          <p style={{ color: styles.textSecondary, marginBottom: "1rem" }}>
            Reset all preset prompts to their default values. This will restore
            the original set of prompts.
          </p>
          {showResetConfirm ? (
            <div className="flex gap-2">
              <button
                onClick={handleResetPresets}
                className="px-4 py-2 rounded-lg transition-colors text-white"
                style={{ backgroundColor: styles.primary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
              >
                Confirm Reset
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: styles.hoverBg,
                  color: styles.text,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = styles.border;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = styles.hoverBg;
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 rounded-lg transition-colors text-white"
              style={{ backgroundColor: styles.primary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              Reset to Default
            </button>
          )}
        </motion.div>

      </div>
    </motion.div>
  );
}

