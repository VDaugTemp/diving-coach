"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useThemeStyles } from "@/hooks/useThemeStyles";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const styles = useThemeStyles();

  const themeOptions: Array<{ mode: "light" | "hacker" | "designer"; icon: string; label: string }> = [
    { mode: "light", icon: "☀️", label: "Light" },
    { mode: "hacker", icon: "💻", label: "Hacker" },
    { mode: "designer", icon: "🖌️", label: "Designer" },
  ];

  const currentTheme = themeOptions.find((t) => t.mode === theme) || themeOptions[0];

  const handleToggle = () => {
    const currentIndex = themeOptions.findIndex((t) => t.mode === theme);
    const nextIndex = (currentIndex + 1) % themeOptions.length;
    setTheme(themeOptions[nextIndex].mode);
  };

  return (
    <motion.button
      onClick={handleToggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="p-2 rounded-lg transition-all duration-300"
      style={{
        background: styles.hoverBg,
        border: styles.cardBorder,
      }}
      aria-label={`Switch theme. Current: ${currentTheme.label}`}
    >
      <span className="text-xl">{currentTheme.icon}</span>
    </motion.button>
  );
}

