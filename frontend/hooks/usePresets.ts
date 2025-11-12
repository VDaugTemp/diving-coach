/**
 * Hook for managing preset prompts with localStorage persistence
 */

import { useState, useEffect } from "react";
import {
  DEFAULT_PRESETS,
  PresetCategory,
} from "@/data/presets";

const PRESETS_KEY = "custom_presets";

export function usePresets() {
  const [presets, setPresets] = useState<PresetCategory[]>(DEFAULT_PRESETS);

  // Load presets from localStorage on mount
  useEffect(() => {
    try {
      const storedPresets = localStorage.getItem(PRESETS_KEY);
      if (storedPresets) {
        setPresets(JSON.parse(storedPresets));
      }
    } catch (error) {
      console.error("Error loading presets:", error);
    }
  }, []);

  // Reset to default presets
  const resetToDefault = () => {
    setPresets(DEFAULT_PRESETS);
    localStorage.removeItem(PRESETS_KEY);
  };

  return {
    presets,
    resetToDefault,
  };
}

