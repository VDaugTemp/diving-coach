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

  // Select a random prompt from all categories for mobile view
  useEffect(() => {
    const allPrompts: PresetPrompt[] = presets.flatMap(
      (category) => category.prompts
    );
    if (allPrompts.length > 0) {
      const randomIndex = Math.floor(Math.random() * allPrompts.length);
      setRandomPrompt(allPrompts[randomIndex]);
    }
  }, [presets]);

  const handleSelect = (prompt: PresetPrompt) => {
    onSelect(prompt.text);
  };

  return (
    <div
      className="h-full p-6 overflow-y-auto flex flex-col items-center justify-center"
      style={{ backgroundColor: styles.bg }}
    >
      <div className="w-full max-w-6xl">
        <h3
          className="text-lg font-semibold mb-4 text-center"
          style={{ color: styles.text, fontFamily: styles.fontFamily }}
        >
          Quick Start Prompts
        </h3>

        {/* Mobile: Show only 1 random prompt */}
        {randomPrompt && (
          <div className="block md:hidden flex flex-col items-center">
            <div className="mb-2">
              <span className="text-sm" style={{ color: styles.textSecondary }}>
                Try this:
              </span>
            </div>
            <motion.button
              onClick={() => handleSelect(randomPrompt)}
              className="group relative w-full max-w-md text-left p-4 border rounded-lg transition-all duration-200 animate-fade-in"
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
              <p className="text-sm leading-relaxed pr-6">
                {randomPrompt.text}
              </p>
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ color: styles.primary }}
              >
                ▶️
              </span>
            </motion.button>
          </div>
        )}

        {/* Desktop/Tablet: Show categories with responsive visibility */}
        <div className="hidden md:block space-y-6">
          {presets.map((category, categoryIndex) => {
            // Show different numbers of categories based on screen size:
            // md (768px+): Show first 3 categories
            // lg (1024px+): Show first 4 categories
            // xl (1280px+): Show first 4 categories
            // 2xl (1536px+, 16-inch screens): Show first 5 categories
            // 3xl (1920px+, larger screens): Show all 6 categories
            let categoryVisibilityClass = "";
            if (categoryIndex < 3) {
              // First 3 categories: visible on md and up
              categoryVisibilityClass = "";
            } else if (categoryIndex < 4) {
              // Category 4: visible on lg and up
              categoryVisibilityClass = "hidden lg:block";
            } else if (categoryIndex < 5) {
              // Category 5: visible on 2xl and up (16-inch screens)
              categoryVisibilityClass = "hidden 2xl:block";
            } else {
              // Category 6: visible on 3xl and up (larger screens)
              categoryVisibilityClass = "hidden 3xl:block";
            }

            return (
              <div
                key={category.name}
                className={`space-y-2 ${categoryVisibilityClass} animate-fade-in`}
                style={{ animationDelay: `${categoryIndex * 150}ms` }}
              >
                {/* Category Header */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-xl">{category.emoji}</span>
                  <h4
                    className="text-sm font-semibold"
                    style={{
                      color: styles.text,
                      fontFamily: styles.fontFamily,
                    }}
                  >
                    {category.name}
                  </h4>
                </div>

                {/* Prompts Grid - Stack on tablet (md), 3 columns on desktop (lg) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                  {category.prompts.map((prompt, index) => {
                    // Show first 2 on tablet (md), first 3 on desktop (lg)
                    // index 0, 1: always visible (no class needed)
                    // index 2: visible only on lg (desktop) - "hidden lg:block"
                    // index 3+: hidden - "hidden"
                    let visibilityClass = "";
                    if (index === 2) {
                      visibilityClass = "hidden lg:block"; // Show 3rd prompt only on desktop
                    } else if (index > 2) {
                      visibilityClass = "hidden"; // Hide prompts beyond 3rd
                    }

                    return (
                      <motion.button
                        key={prompt.id}
                        onClick={() => handleSelect(prompt)}
                        className={`group relative text-left p-3 border rounded-lg transition-all duration-200 ${visibilityClass} animate-fade-in`}
                        style={{
                          animationDelay: `${categoryIndex * 100 +
                            index * 50}ms`,
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
                        <p className="text-sm leading-relaxed pr-6">
                          {prompt.text}
                        </p>
                        <span
                          className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          style={{ color: styles.primary }}
                        >
                          ▶️
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
