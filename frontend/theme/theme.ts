// Comprehensive theme configuration
// This file defines all theme values for each theme mode
// Using a centralized theme object eliminates the need for ternary statements throughout the codebase

export type ThemeMode = "light" | "hacker" | "designer";

// Theme color interface
export interface ThemeColors {
  // Base colors
  bg: string;
  surface: string;
  primary: string;
  secondary: string;
  text: string;
  textSecondary: string;
  border: string;
  
  // Effects
  glow: string;
  hoverGlow: string;
  
  // Components
  cardBg: string;
  cardBorder: string;
  inputBg: string;
  
  // Messages
  messageUserBg: string;
  messageUserText: string;
  messageUserBoxShadow: string;
  messageBotBg: string;
  messageBotText: string;
  
  // Typography
  fontFamily: string;
  
  // Interactive states
  hoverBg: string;
  buttonText: string;
  
  // Special effects
  backdropBlur: string;
  boxShadow: string;
  cardBoxShadow: string;
  
  // Chart colors
  chartLine: string;
  chartBar: string;
  
  // Success/Info states
  successBg: string;
  successBorder: string;
  successText: string;
  
  // Card variant colors (for metrics dashboard)
  cardColors: {
    primary: { bg: string; glow: string; value: string };
    secondary: { bg: string; glow: string; value: string };
    tertiary: { bg: string; glow: string; value: string };
    quaternary: { bg: string; glow: string; value: string };
  };
}

// Complete theme definitions
export const themes: Record<ThemeMode, ThemeColors> = {
  light: {
    bg: "#f3f4f6",
    surface: "#ffffff",
    primary: "#3b82f6",
    secondary: "#6b7280",
    text: "#1f2937",
    textSecondary: "#6b7280",
    border: "#e5e7eb",
    glow: "rgba(59, 130, 246, 0.1)",
    hoverGlow: "0 4px 12px rgba(59, 130, 246, 0.2)",
    cardBg: "#ffffff",
    cardBorder: "1px solid #e5e7eb",
    inputBg: "rgba(255, 255, 255, 0.8)",
    messageUserBg: "#3b82f6",
    messageUserText: "#ffffff",
    messageUserBoxShadow: "none",
    messageBotBg: "#ffffff",
    messageBotText: "#1f2937",
    fontFamily: "'Inter', sans-serif",
    hoverBg: "rgba(0, 0, 0, 0.05)",
    buttonText: "#ffffff",
    backdropBlur: "blur(10px)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
    cardBoxShadow: "0 4px 12px rgba(59, 130, 246, 0.2)",
    chartLine: "#3b82f6",
    chartBar: "#10b981",
    successBg: "#dcfce7",
    successBorder: "#86efac",
    successText: "#166534",
    cardColors: {
      primary: {
        bg: "rgba(59, 130, 246, 0.08)",
        glow: "rgba(59, 130, 246, 0.2)",
        value: "#3b82f6",
      },
      secondary: {
        bg: "rgba(16, 185, 129, 0.08)",
        glow: "rgba(16, 185, 129, 0.2)",
        value: "#10b981",
      },
      tertiary: {
        bg: "rgba(168, 85, 247, 0.08)",
        glow: "rgba(168, 85, 247, 0.2)",
        value: "#9333ea",
      },
      quaternary: {
        bg: "rgba(249, 115, 22, 0.08)",
        glow: "rgba(249, 115, 22, 0.2)",
        value: "#f97316",
      },
    },
  },
  
  hacker: {
    bg: "#0f1115",
    surface: "#1a1c20",
    primary: "#5eead4",
    secondary: "#94a3b8",
    text: "#e2e8f0",
    textSecondary: "#94a3b8",
    border: "#5eead4",
    glow: "rgba(94, 234, 212, 0.3)",
    hoverGlow: "0 0 20px rgba(94, 234, 212, 0.5)",
    cardBg: "#1a1c20",
    cardBorder: "1px solid rgba(94, 234, 212, 0.3)",
    inputBg: "rgba(26, 28, 32, 0.8)",
    messageUserBg: "#5eead4",
    messageUserText: "#0f1115",
    messageUserBoxShadow: "0 0 10px rgba(94, 234, 212, 0.3)",
    messageBotBg: "#1a1c20",
    messageBotText: "#e2e8f0",
    fontFamily: "'JetBrains Mono', monospace",
    hoverBg: "rgba(94, 234, 212, 0.1)",
    buttonText: "#0f1115",
    backdropBlur: "blur(20px)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(94, 234, 212, 0.1)",
    cardBoxShadow: "0 0 15px rgba(94, 234, 212, 0.3)",
    chartLine: "#5eead4",
    chartBar: "#5eead4",
    successBg: "rgba(94, 234, 212, 0.1)",
    successBorder: "#5eead4",
    successText: "#5eead4",
    cardColors: {
      primary: {
        bg: "rgba(94, 234, 212, 0.08)",
        glow: "rgba(94, 234, 212, 0.2)",
        value: "#5eead4",
      },
      secondary: {
        bg: "rgba(94, 234, 212, 0.08)",
        glow: "rgba(94, 234, 212, 0.2)",
        value: "#5eead4",
      },
      tertiary: {
        bg: "rgba(94, 234, 212, 0.08)",
        glow: "rgba(94, 234, 212, 0.2)",
        value: "#5eead4",
      },
      quaternary: {
        bg: "rgba(94, 234, 212, 0.08)",
        glow: "rgba(94, 234, 212, 0.2)",
        value: "#5eead4",
      },
    },
  },
  
  designer: {
    bg: "#fef7f0",
    surface: "#fff9f3",
    primary: "#d97757",
    secondary: "#b8956a",
    text: "#2d1b0e",
    textSecondary: "#6b5d4a",
    border: "#d97757",
    glow: "rgba(217, 119, 87, 0.25)",
    hoverGlow: "0 4px 12px rgba(217, 119, 87, 0.4)",
    cardBg: "#ffffff",
    cardBorder: "1px solid rgba(217, 119, 87, 0.2)",
    inputBg: "rgba(255, 249, 243, 0.9)",
    messageUserBg: "#d97757",
    messageUserText: "#ffffff",
    messageUserBoxShadow: "0 2px 8px rgba(217, 119, 87, 0.3)",
    messageBotBg: "#fff9f3",
    messageBotText: "#2d1b0e",
    fontFamily: "'Inter', sans-serif",
    hoverBg: "rgba(217, 119, 87, 0.15)",
    buttonText: "#ffffff",
    backdropBlur: "blur(10px)",
    boxShadow: "0 8px 32px rgba(217, 119, 87, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
    cardBoxShadow: "0 4px 12px rgba(217, 119, 87, 0.25)",
    chartLine: "#d97757",
    chartBar: "#b8956a",
    successBg: "rgba(217, 119, 87, 0.15)",
    successBorder: "#d97757",
    successText: "#2d1b0e",
    cardColors: {
      primary: {
        bg: "rgba(217, 119, 87, 0.12)",
        glow: "rgba(217, 119, 87, 0.3)",
        value: "#d97757",
      },
      secondary: {
        bg: "rgba(184, 149, 106, 0.12)",
        glow: "rgba(184, 149, 106, 0.3)",
        value: "#b8956a",
      },
      tertiary: {
        bg: "rgba(217, 119, 87, 0.12)",
        glow: "rgba(217, 119, 87, 0.3)",
        value: "#d97757",
      },
      quaternary: {
        bg: "rgba(184, 149, 106, 0.12)",
        glow: "rgba(184, 149, 106, 0.3)",
        value: "#b8956a",
      },
    },
  },
};

// Font configuration (for Chakra UI compatibility)
export const theme = {
  fonts: {
    heading: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`,
    body: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`,
    mono: `'JetBrains Mono', 'Courier New', monospace`,
  },
};

