"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { themes, type ThemeMode } from "@/theme/theme";

export type { ThemeMode };

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "ai-chat-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode;
    if (stored && ["light", "hacker", "designer"].includes(stored)) {
      setThemeState(stored);
    }
    setMounted(true);
  }, []);

  // Apply theme to document and set CSS variables
  useEffect(() => {
    if (!mounted) return;
    
    const currentTheme = themes[theme];
    const root = document.documentElement;
    
    // Set data-theme attribute for CSS selectors
    root.setAttribute("data-theme", theme);
    
    // Set CSS custom properties (CSS variables) for theme values
    root.style.setProperty("--theme-bg", currentTheme.bg);
    root.style.setProperty("--theme-surface", currentTheme.surface);
    root.style.setProperty("--theme-primary", currentTheme.primary);
    root.style.setProperty("--theme-secondary", currentTheme.secondary);
    root.style.setProperty("--theme-text", currentTheme.text);
    root.style.setProperty("--theme-text-secondary", currentTheme.textSecondary);
    root.style.setProperty("--theme-border", currentTheme.border);
    root.style.setProperty("--theme-glow", currentTheme.glow);
    root.style.setProperty("--theme-hover-glow", currentTheme.hoverGlow);
    root.style.setProperty("--theme-card-bg", currentTheme.cardBg);
    root.style.setProperty("--theme-card-border", currentTheme.cardBorder);
    root.style.setProperty("--theme-input-bg", currentTheme.inputBg);
    root.style.setProperty("--theme-message-user-bg", currentTheme.messageUserBg);
    root.style.setProperty("--theme-message-user-text", currentTheme.messageUserText);
    root.style.setProperty("--theme-message-user-box-shadow", currentTheme.messageUserBoxShadow);
    root.style.setProperty("--theme-message-bot-bg", currentTheme.messageBotBg);
    root.style.setProperty("--theme-message-bot-text", currentTheme.messageBotText);
    root.style.setProperty("--theme-font-family", currentTheme.fontFamily);
    root.style.setProperty("--theme-hover-bg", currentTheme.hoverBg);
    root.style.setProperty("--theme-button-text", currentTheme.buttonText);
    root.style.setProperty("--theme-backdrop-blur", currentTheme.backdropBlur);
    root.style.setProperty("--theme-box-shadow", currentTheme.boxShadow);
    root.style.setProperty("--theme-card-box-shadow", currentTheme.cardBoxShadow);
    root.style.setProperty("--theme-chart-line", currentTheme.chartLine);
    root.style.setProperty("--theme-chart-bar", currentTheme.chartBar);
    root.style.setProperty("--theme-success-bg", currentTheme.successBg);
    root.style.setProperty("--theme-success-border", currentTheme.successBorder);
    root.style.setProperty("--theme-success-text", currentTheme.successText);
    
    // Persist theme preference
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme, mounted]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  // Always provide the context, even before mounting
  // This prevents "useTheme must be used within a ThemeProvider" errors
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

