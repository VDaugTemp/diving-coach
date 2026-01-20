"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { themes, type ThemeColors } from "@/theme/theme";
import { useMemo } from "react";

/**
 * Hook to get the current theme styles
 * Returns the complete theme object for the current theme mode
 * This eliminates the need for ternary statements throughout the codebase
 * 
 * Note: Always returns a valid theme object, even before client mounting.
 * For components that need to wait for mounting (e.g., rendering theme-specific
 * text/icons), use the `mounted` property from useTheme() directly.
 */
export function useThemeStyles(): ThemeColors {
  const { theme } = useTheme();

  return useMemo(() => {
    return themes[theme];
  }, [theme]);
}

