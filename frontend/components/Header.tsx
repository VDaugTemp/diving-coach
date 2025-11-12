"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useThemeStyles } from "@/hooks/useThemeStyles";
import { useState } from "react";
import SettingsModal from "./SettingsModal";

export default function Header() {
  const styles = useThemeStyles();
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  return (
    <>
      <motion.header
        className="border-b px-6 py-4"
        style={{
          backgroundColor: styles.surface,
          borderColor: styles.border,
        }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center">
          {/* Logo/Title - clickable to home */}
          <Link href="/" className="flex items-center">
            <h1
              className="text-2xl font-bold gradient-text cursor-pointer"
              style={{ fontFamily: styles.fontFamily }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              AI Chat Application
            </h1>
          </Link>

          {/* Theme Toggle and Settings */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-2 rounded-lg transition-colors"
              style={{
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = styles.hoverBg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
              aria-label="Open settings"
            >
              <span className="text-2xl">⚙️</span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </>
  );
}

