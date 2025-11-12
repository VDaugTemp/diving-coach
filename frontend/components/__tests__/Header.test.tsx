import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "../Header";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ChatHistoryProvider } from "@/contexts/ChatHistoryContext";

// Mock useThemeStyles
jest.mock("@/hooks/useThemeStyles", () => ({
  useThemeStyles: () => ({
    surface: "#ffffff",
    border: "#e0e0e0",
    text: "#000000",
    fontFamily: "system-ui",
    hoverBg: "#f0f0f0",
  }),
}));

// Mock ThemeToggle
jest.mock("../ThemeToggle", () => {
  return function MockThemeToggle() {
    return <div data-testid="theme-toggle">Theme Toggle</div>;
  };
});

// Mock SettingsModal
jest.mock("../SettingsModal", () => {
  return function MockSettingsModal({
    isOpen,
    onClose,
  }: {
    isOpen: boolean;
    onClose: () => void;
  }) {
    if (!isOpen) return null;
    return (
      <div data-testid="settings-modal">
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      <ChatHistoryProvider sessionId={null}>
        {component}
      </ChatHistoryProvider>
    </ThemeProvider>
  );
};

describe("Header", () => {
  it("renders the application title", () => {
    renderWithProviders(<Header />);
    expect(screen.getByText("AI Chat Application")).toBeInTheDocument();
  });

  it("renders the title as a link to home", () => {
    renderWithProviders(<Header />);
    const titleLink = screen.getByText("AI Chat Application").closest("a");
    expect(titleLink).toHaveAttribute("href", "/");
  });

  it("renders the theme toggle", () => {
    renderWithProviders(<Header />);
    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
  });

  it("renders the settings button", () => {
    renderWithProviders(<Header />);
    const settingsButton = screen.getByRole("button", {
      name: /open settings/i,
    });
    expect(settingsButton).toBeInTheDocument();
  });

  it("opens settings modal when settings button is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Header />);

    const settingsButton = screen.getByRole("button", {
      name: /open settings/i,
    });

    expect(screen.queryByTestId("settings-modal")).not.toBeInTheDocument();

    await user.click(settingsButton);

    expect(screen.getByTestId("settings-modal")).toBeInTheDocument();
  });

  it("closes settings modal when close button is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Header />);

    const settingsButton = screen.getByRole("button", {
      name: /open settings/i,
    });

    // Open modal
    await user.click(settingsButton);
    expect(screen.getByTestId("settings-modal")).toBeInTheDocument();

    // Close modal
    const closeButton = screen.getByRole("button", { name: /close/i });
    await user.click(closeButton);

    expect(screen.queryByTestId("settings-modal")).not.toBeInTheDocument();
  });
});

