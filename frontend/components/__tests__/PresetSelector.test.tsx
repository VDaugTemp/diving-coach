import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PresetSelector from "../PresetSelector";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ChatHistoryProvider } from "@/contexts/ChatHistoryContext";

// Mock the usePresets hook with stable references
const mockPresets = [
  {
    name: "Learning / Skill Growth",
    emoji: "💡",
    prompts: [
      {
        id: "learn-1",
        text: "Explain a complex topic to me as if I'm 10 years old — start with quantum physics.",
        category: "Learning",
        emoji: "💡",
      },
      {
        id: "learn-2",
        text: "Quiz me on Python basics with 5 questions, increasing in difficulty.",
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
    ],
  },
];

// Create a stable return value object
const mockUsePresetsReturn = {
  presets: mockPresets,
  resetToDefault: jest.fn(),
};

jest.mock("@/hooks/usePresets", () => ({
  usePresets: jest.fn(() => mockUsePresetsReturn),
}));

// Mock useThemeStyles
jest.mock("@/hooks/useThemeStyles", () => ({
  useThemeStyles: () => ({
    bg: "#ffffff",
    text: "#000000",
    textSecondary: "#666666",
    cardBg: "#f5f5f5",
    border: "#e0e0e0",
    primary: "#0070f3",
    cardBoxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  }),
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      <ChatHistoryProvider sessionId={null}>
        {component}
      </ChatHistoryProvider>
    </ThemeProvider>
  );
};

describe("PresetSelector", () => {
  const mockOnSelect = jest.fn();
  const originalRandom = Math.random;

  beforeEach(() => {
    mockOnSelect.mockClear();
    // Mock Math.random to return a fixed value to prevent infinite loops
    Math.random = jest.fn(() => 0.5);
  });

  afterEach(() => {
    Math.random = originalRandom;
  });

  it("renders the Quick Start Prompts heading", () => {
    renderWithProviders(<PresetSelector onSelect={mockOnSelect} />);
    expect(screen.getByText("Quick Start Prompts")).toBeInTheDocument();
  });

  it("displays category names and emojis", () => {
    renderWithProviders(<PresetSelector onSelect={mockOnSelect} />);
    expect(screen.getByText("Learning / Skill Growth")).toBeInTheDocument();
    expect(screen.getByText("Games / Fun / Pass Time")).toBeInTheDocument();
  });

  it("displays preset prompts from all categories", () => {
    renderWithProviders(<PresetSelector onSelect={mockOnSelect} />);
    // Use getAllByText and check that at least one exists (may appear in both mobile and desktop)
    expect(
      screen.getAllByText(
        /Explain a complex topic to me as if I'm 10 years old/i
      ).length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/Quiz me on Python basics/i).length
    ).toBeGreaterThan(0);
    expect(screen.getAllByText(/Make me a riddle/i).length).toBeGreaterThan(0);
  });

  it("calls onSelect with prompt text when a preset is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PresetSelector onSelect={mockOnSelect} />);

    // Use getAllByText and click the first one (may appear in both mobile and desktop)
    const promptButtons = screen.getAllByText(
      /Explain a complex topic to me as if I'm 10 years old/i
    );
    await user.click(promptButtons[0]);

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith(
      "Explain a complex topic to me as if I'm 10 years old — start with quantum physics."
    );
  });

  it("handles multiple preset selections", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PresetSelector onSelect={mockOnSelect} />);

    // Use getAllByText and click the first one (may appear in both mobile and desktop)
    const firstPrompts = screen.getAllByText(
      /Explain a complex topic to me as if I'm 10 years old/i
    );
    const secondPrompts = screen.getAllByText(/Quiz me on Python basics/i);

    await user.click(firstPrompts[0]);
    await user.click(secondPrompts[0]);

    expect(mockOnSelect).toHaveBeenCalledTimes(2);
    expect(mockOnSelect).toHaveBeenNthCalledWith(
      1,
      "Explain a complex topic to me as if I'm 10 years old — start with quantum physics."
    );
    expect(mockOnSelect).toHaveBeenNthCalledWith(
      2,
      "Quiz me on Python basics with 5 questions, increasing in difficulty."
    );
  });

  it("shows random prompt on mobile view", async () => {
    // Mock window.matchMedia to simulate mobile
    const mockMatchMedia = jest.fn().mockImplementation((query) => ({
      matches: query === "(max-width: 767px)",
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
    
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: mockMatchMedia,
    });

    renderWithProviders(<PresetSelector onSelect={mockOnSelect} />);

    // Wait for the random prompt to be selected
    // The useEffect should run once and set the random prompt
    await waitFor(
      () => {
        const tryThisText = screen.queryByText("Try this:");
        expect(tryThisText).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });
});

