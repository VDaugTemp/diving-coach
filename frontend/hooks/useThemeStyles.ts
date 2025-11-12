"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { themes, type ThemeColors } from "@/theme/theme";
import { useMemo } from "react";

/**
 * Hook to get the current theme styles
 * Returns the complete theme object for the current theme mode
 * This eliminates the need for ternary statements throughout the codebase
 */
export function useThemeStyles(): ThemeColors {
  const { theme } = useTheme();

  return useMemo(() => {
    return themes[theme];
  }, [theme]);
}

