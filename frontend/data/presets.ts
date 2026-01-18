/**
 * Preset prompts organized by category
 * These are the default prompts that users can select from
 */

export interface PresetPrompt {
  id: string;
  text: string;
  category: string;
  emoji: string;
}

export interface PresetCategory {
  name: string;
  emoji: string;
  prompts: PresetPrompt[];
}

// Default preset prompts - this is the original set that can be restored
export const DEFAULT_PRESETS: PresetCategory[] = [
  {
    name: "Safety & Risk Management",
    emoji: "🛟",
    prompts: [
      {
        id: "safety-1",
        text:
          "Explain the risks of shallow water blackout and how divers reduce them.",
        category: "Safety",
        emoji: "🛟",
      },
      {
        id: "safety-2",
        text:
          "What are the key considerations for safe equalization during descent?",
        category: "Safety",
        emoji: "🛟",
      },
      {
        id: "safety-3",
        text:
          "What should I consider before returning to scuba diving after a long break?",
        category: "Safety",
        emoji: "🛟",
      },
    ],
  },
  {
    name: "Freediving Training",
    emoji: "🌊",
    prompts: [
      {
        id: "freediving-1",
        text:
          "How should a beginner structure freediving training in a pool?",
        category: "Freediving",
        emoji: "🌊",
      },
      {
        id: "freediving-2",
        text:
          "What are the differences between static, dynamic, and depth freediving disciplines?",
        category: "Freediving",
        emoji: "🌊",
      },
      {
        id: "freediving-3",
        text:
          "How does CO₂ tolerance training work, and what does it actually improve?",
        category: "Freediving",
        emoji: "🌊",
      },
    ],
  },
  {
    name: "Scuba Fundamentals",
    emoji: "🤿",
    prompts: [
      {
        id: "scuba-1",
        text:
          "What is the relationship between depth, pressure, and air consumption in scuba diving?",
        category: "Scuba",
        emoji: "🤿",
      },
      {
        id: "scuba-2",
        text:
          "Explain how decompression sickness occurs and how dive planning helps prevent it.",
        category: "Scuba",
        emoji: "🤿",
      },
      {
        id: "scuba-3",
        text:
          "What are the key differences between recreational and technical diving?",
        category: "Scuba",
        emoji: "🤿",
      },
    ],
  },
  {
    name: "Physiology & Breathing",
    emoji: "🫁",
    prompts: [
      {
        id: "physiology-1",
        text:
          "How does breath-hold affect oxygen and CO₂ levels in the body during freediving?",
        category: "Physiology",
        emoji: "🫁",
      },
      {
        id: "physiology-2",
        text:
          "What is the mammalian dive reflex and how does it help freedivers?",
        category: "Physiology",
        emoji: "🫁",
      },
      {
        id: "physiology-3",
        text:
          "Why is proper breathing technique important before a freedive?",
        category: "Physiology",
        emoji: "🫁",
      },
    ],
  },
  {
    name: "Equipment & Preparation",
    emoji: "⚙️",
    prompts: [
      {
        id: "equipment-1",
        text:
          "What equipment is essential for a beginner freediver, and what can wait?",
        category: "Equipment",
        emoji: "⚙️",
      },
      {
        id: "equipment-2",
        text:
          "How do I choose the right wetsuit thickness for different water temperatures?",
        category: "Equipment",
        emoji: "⚙️",
      },
      {
        id: "equipment-3",
        text:
          "What should be included in a pre-dive safety check for scuba gear?",
        category: "Equipment",
        emoji: "⚙️",
      },
    ],
  },
  {
    name: "Training Principles",
    emoji: "📊",
    prompts: [
      {
        id: "training-1",
        text:
          "How should I structure a progressive training plan for improving breath-hold time?",
        category: "Training",
        emoji: "📊",
      },
      {
        id: "training-2",
        text:
          "What are the signs of overtraining in freediving, and how can I avoid them?",
        category: "Training",
        emoji: "📊",
      },
      {
        id: "training-3",
        text:
          "How do dry training exercises complement in-water freediving practice?",
        category: "Training",
        emoji: "📊",
      },
    ],
  },
];
