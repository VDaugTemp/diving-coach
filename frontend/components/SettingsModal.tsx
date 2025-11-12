"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useThemeStyles } from "@/hooks/useThemeStyles";
import { useTheme } from "@/contexts/ThemeContext";
import { themes } from "@/theme/theme";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, setTheme } = useTheme();
  const styles = useThemeStyles();
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <motion.div
        ref={modalRef}
        className="fixed right-0 top-0 h-full w-full max-w-md shadow-xl z-50 overflow-y-auto"
        style={{
          backgroundColor: styles.surface,
          borderLeft: `1px solid ${styles.border}`,
        }}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div
            className="flex justify-between items-center border-b pb-4"
            style={{ borderColor: styles.border }}
          >
            <h2
              className="text-2xl font-bold gradient-text"
              style={{ fontFamily: styles.fontFamily }}
            >
              Settings
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors"
              style={{ color: styles.text }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = styles.hoverBg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
              aria-label="Close settings"
            >
              ✕
            </button>
          </div>

          {/* Theme Selection */}
          <div
            className="rounded-lg border p-6"
            style={{
              backgroundColor: styles.cardBg,
              borderColor: styles.border,
            }}
          >
            <h3
              className="text-xl font-bold mb-4 gradient-text"
              style={{ fontFamily: styles.fontFamily }}
            >
              Theme
            </h3>
            <div className="flex items-center justify-between mb-4">
              <span style={{ color: styles.textSecondary }}>
                Current theme:
              </span>
              <ThemeToggle />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {(["light", "hacker", "designer"] as const).map((themeOption) => {
                const optionTheme = themes[themeOption];
                return (
                  <motion.button
                    key={themeOption}
                    onClick={() => setTheme(themeOption)}
                    className="p-3 rounded-lg border-2 transition-all"
                    style={{
                      backgroundColor: optionTheme.surface,
                      borderColor:
                        theme === themeOption
                          ? optionTheme.primary
                          : styles.border,
                      color: styles.text,
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div
                      className="w-full h-12 rounded mb-2"
                      style={{ backgroundColor: optionTheme.bg }}
                    />
                    <div
                      className="w-full h-2 rounded mb-1"
                      style={{ backgroundColor: optionTheme.primary }}
                    />
                    <div
                      className="text-xs font-semibold capitalize"
                      style={{ color: optionTheme.text }}
                    >
                      {themeOption}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            <Link
              href="/metrics"
              onClick={onClose}
              className="block w-full px-4 py-3 border rounded-lg transition-colors font-medium"
              style={{
                backgroundColor: styles.hoverBg,
                borderColor: styles.border,
                color: styles.primary,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              📊 View Metrics Dashboard
            </Link>
            <Link
              href="/about"
              onClick={onClose}
              className="block w-full px-4 py-3 border rounded-lg transition-colors font-medium"
              style={{
                backgroundColor: styles.hoverBg,
                borderColor: styles.border,
                color: styles.secondary,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              ℹ️ About This Project
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  );
}
