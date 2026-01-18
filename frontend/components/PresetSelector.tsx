"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePresets } from "@/hooks/usePresets";
import { useThemeStyles } from "@/hooks/useThemeStyles";
import { PresetPrompt } from "@/data/presets";

interface PresetSelectorProps {
  onSelect: (prompt: string) => void;
}

export default function PresetSelector({ onSelect }: PresetSelectorProps) {
  const { presets } = usePresets();
  const styles = useThemeStyles();
  const [randomPrompt, setRandomPrompt] = useState<PresetPrompt | null>(null);

  // Select a random prompt from all categories
  const selectRandomPrompt = () => {
    const allPrompts: PresetPrompt[] = presets.flatMap(
      (category) => category.prompts
    );
    if (allPrompts.length > 0) {
      const randomIndex = Math.floor(Math.random() * allPrompts.length);
      setRandomPrompt(allPrompts[randomIndex]);
    }
  };

  // Select a random prompt on mount and when presets change
  useEffect(() => {
    selectRandomPrompt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presets]);

  const handleSelect = (prompt: PresetPrompt) => {
    onSelect(prompt.text);
  };

  const handleNewPrompt = () => {
    selectRandomPrompt();
  };

  return (
    <div
      className="h-full p-6 overflow-y-auto flex flex-col items-center justify-center"
      style={{ backgroundColor: styles.bg }}
    >
      <div className="w-full max-w-2xl flex flex-col items-center">
        <div className="mb-6 text-center max-w-xl">
          <h3
            className="text-2xl font-semibold mb-3"
            style={{ color: styles.text, fontFamily: styles.fontFamily }}
          >
            Welcome to Your Diving Coach 🤿
          </h3>
          <p
            className="text-base leading-relaxed mb-2"
            style={{ color: styles.textSecondary, fontFamily: styles.fontFamily }}
          >
            This assistant helps you understand diving principles, safety considerations, 
            and training structure for scuba and freediving.
          </p>
          <p
            className="text-sm italic"
            style={{ color: styles.textSecondary, fontFamily: styles.fontFamily, opacity: 0.8 }}
          >
            Educational only • Not a replacement for professional instruction • Always dive with a buddy
          </p>
        </div>

        {/* Show only 1 random prompt for all screen sizes */}
        {randomPrompt && (
          <div className="flex flex-col items-center w-full">
            <motion.button
              onClick={() => handleSelect(randomPrompt)}
              className="group relative w-full text-left p-6 border rounded-lg transition-all duration-200 animate-fade-in mb-4"
              style={{
                backgroundColor: styles.cardBg,
                borderColor: styles.border,
                color: styles.text,
                fontFamily: styles.fontFamily,
              }}
              whileHover={{
                scale: 1.02,
                boxShadow: styles.cardBoxShadow,
              }}
            >
              <p className="text-base leading-relaxed pr-8">
                {randomPrompt.text}
              </p>
              <span
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ color: styles.primary }}
              >
                ▶️
              </span>
            </motion.button>

            {/* Button to get a new random prompt */}
            <motion.button
              onClick={handleNewPrompt}
              className="text-sm px-4 py-2 rounded-lg border transition-all duration-200"
              style={{
                backgroundColor: styles.surface,
                borderColor: styles.border,
                color: styles.textSecondary,
                fontFamily: styles.fontFamily,
              }}
              whileHover={{
                backgroundColor: styles.cardBg,
                scale: 1.05,
              }}
            >
              Show me another topic
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
