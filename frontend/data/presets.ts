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
    name: "Learning / Skill Growth",
    emoji: "💡",
    prompts: [
      {
        id: "learn-1",
        text:
          "Explain a complex topic to me as if I'm 10 years old — start with quantum physics.",
        category: "Learning",
        emoji: "💡",
      },
      {
        id: "learn-2",
        text:
          "Quiz me on Python basics with 5 questions, increasing in difficulty.",
        category: "Learning",
        emoji: "💡",
      },
      {
        id: "learn-3",
        text: "Teach me a random useful fact each day in under 60 seconds.",
        category: "Learning",
        emoji: "💡",
      },
    ],
  },
  {
    name: "Games / Fun / Pass Time",
    emoji: "🎮",
    prompts: [
      {
        id: "game-1",
        text: "Make me a riddle and give me 3 hints.",
        category: "Games",
        emoji: "🎮",
      },
      {
        id: "game-2",
        text: "Would you rather… but with absurd tech scenarios.",
        category: "Games",
        emoji: "🎮",
      },
      {
        id: "game-3",
        text: "Tell me a story one line at a time — I'll add the next.",
        category: "Games",
        emoji: "🎮",
      },
    ],
  },
  {
    name: "Creativity / Writing",
    emoji: "✍️",
    prompts: [
      {
        id: "creative-1",
        text: "Give me a random writing prompt and start the first line.",
        category: "Creativity",
        emoji: "✍️",
      },
      {
        id: "creative-2",
        text: "Generate 3 fake startup ideas and tag them with a funny slogan.",
        category: "Creativity",
        emoji: "✍️",
      },
      {
        id: "creative-3",
        text: "Write a poem that sounds like a mix of Bukowski and Elon Musk.",
        category: "Creativity",
        emoji: "✍️",
      },
    ],
  },
  {
    name: "Mindset / Reflection",
    emoji: "🧘",
    prompts: [
      {
        id: "mindset-1",
        text: "Ask me 3 reflective questions about my week.",
        category: "Mindset",
        emoji: "🧘",
      },
      {
        id: "mindset-2",
        text: "Guide me through a 2-minute breathing exercise.",
        category: "Mindset",
        emoji: "🧘",
      },
      {
        id: "mindset-3",
        text: "Give me one Stoic quote and explain how to apply it today.",
        category: "Mindset",
        emoji: "🧘",
      },
    ],
  },
  {
    name: "Practical / Productivity",
    emoji: "💼",
    prompts: [
      {
        id: "productivity-1",
        text:
          "Tell me about productivity techniques I can use to be more efficient.",
        category: "Productivity",
        emoji: "💼",
      },
      {
        id: "productivity-2",
        text: "Help me brainstorm 5 ways to automate a boring task.",
        category: "Productivity",
        emoji: "💼",
      },
      {
        id: "productivity-3",
        text: "Make a daily focus checklist for deep work.",
        category: "Productivity",
        emoji: "💼",
      },
    ],
  },
  {
    name: "AI / Coding / Techy",
    emoji: "🧩",
    prompts: [
      {
        id: "tech-1",
        text: "Explain embeddings like I'm 12.",
        category: "Tech",
        emoji: "🧩",
      },
      {
        id: "tech-2",
        text: "Suggest a cool AI side project idea.",
        category: "Tech",
        emoji: "🧩",
      },
      {
        id: "tech-3",
        text: "Show how to optimize a React app with memoization.",
        category: "Tech",
        emoji: "🧩",
      },
    ],
  },
];
