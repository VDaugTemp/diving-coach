import React, { useRef } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatInterface, { ChatInterfaceRef } from "../ChatInterface";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ChatHistoryProvider } from "@/contexts/ChatHistoryContext";

// Mock useThemeStyles
jest.mock("@/hooks/useThemeStyles", () => ({
  useThemeStyles: () => ({
    bg: "#ffffff",
    surface: "#f5f5f5",
    border: "#e0e0e0",
    text: "#000000",
    textSecondary: "#666666",
    inputBg: "#ffffff",
    primary: "#0070f3",
    buttonText: "#ffffff",
    messageUserBg: "#0070f3",
    messageUserText: "#ffffff",
    messageBotBg: "#f0f0f0",
    messageBotText: "#000000",
    messageUserBoxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    fontFamily: "system-ui",
  }),
}));

// Mock the API
jest.mock("@/utils/api", () => ({
  streamChat: jest.fn((request, onChunk, onComplete, onError) => {
    // Simulate streaming response with proper async handling
    // Use Promise to ensure proper sequencing
    Promise.resolve()
      .then(() => {
        onChunk("Hello");
        return new Promise((resolve) => setTimeout(resolve, 50));
      })
      .then(() => {
        onChunk(" there");
        return new Promise((resolve) => setTimeout(resolve, 50));
      })
      .then(() => {
        onChunk("!");
        return new Promise((resolve) => setTimeout(resolve, 50));
      })
      .then(() => {
        onComplete();
      });
  }),
}));

// Mock BlobBackground
jest.mock("../BlobBackground", () => {
  return function MockBlobBackground() {
    return <div data-testid="blob-background" />;
  };
});

const renderWithProviders = (
  component: React.ReactElement,
  sessionId: string | null = null
) => {
  return render(
    <ThemeProvider>
      <ChatHistoryProvider sessionId={sessionId}>
        {component}
      </ChatHistoryProvider>
    </ThemeProvider>
  );
};

describe("ChatInterface", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("renders the input textarea", () => {
    renderWithProviders(<ChatInterface />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeInTheDocument();
  });

  it("renders the send button", () => {
    renderWithProviders(<ChatInterface />);
    const sendButton = screen.getByRole("button", { name: /send/i });
    expect(sendButton).toBeInTheDocument();
  });

  it("disables send button when input is empty", () => {
    renderWithProviders(<ChatInterface />);
    const sendButton = screen.getByRole("button", { name: /send/i });
    expect(sendButton).toBeDisabled();
  });

  it("enables send button when input has text", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChatInterface />);

    const textarea = screen.getByRole("textbox");
    const sendButton = screen.getByRole("button", { name: /send/i });

    await user.type(textarea, "Hello");

    expect(sendButton).not.toBeDisabled();
  });

  it("sends message when send button is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChatInterface />);

    const textarea = screen.getByRole("textbox");
    const sendButton = screen.getByRole("button", { name: /send/i });

    await user.type(textarea, "Hello");
    await user.click(sendButton);

    // Wait for message to appear
    await waitFor(() => {
      expect(screen.getByText("Hello")).toBeInTheDocument();
    });
  });

  it("sends message when Enter key is pressed", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChatInterface />);

    const textarea = screen.getByRole("textbox");

    await user.type(textarea, "Hello{Enter}");

    // Wait for message to appear
    await waitFor(() => {
      expect(screen.getByText("Hello")).toBeInTheDocument();
    });
  });

  it("clears input after sending message", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChatInterface />);

    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

    await user.type(textarea, "Hello");
    await user.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() => {
      expect(textarea.value).toBe("");
    });
  });

  it("displays user messages", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChatInterface />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "Hello{Enter}");

    await waitFor(() => {
      expect(screen.getByText("Hello")).toBeInTheDocument();
    });
  });

  it("displays assistant response after streaming", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChatInterface />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "Hello{Enter}");

    // Wait for streaming to complete - check for the complete message
    // The message might be split across chunks or elements
    await waitFor(
      () => {
        // Check if "Hello there!" appears anywhere in the document
        // It might be split across multiple elements
        const allText = document.body.textContent || "";
        expect(allText).toContain("Hello there!");
      },
      { timeout: 2000 }
    );
  });

  it("disables input while streaming", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChatInterface />);

    const textarea = screen.getByRole("textbox");
    const sendButton = screen.getByRole("button", { name: /send/i });

    await user.type(textarea, "Hello");
    await user.click(sendButton);

    // Input should be disabled while streaming
    await waitFor(() => {
      expect(textarea).toBeDisabled();
    });
  });

  it("shows placeholder text when input is empty", () => {
    renderWithProviders(<ChatInterface />);
    expect(screen.getByText(/Type your message/i)).toBeInTheDocument();
  });

  it("renders in input-only mode when showInputOnly is true and no messages", () => {
    renderWithProviders(<ChatInterface showInputOnly={true} />);

    // Should show input but not messages container
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
    expect(screen.queryByTestId("blob-background")).not.toBeInTheDocument();
  });

  it("does not send empty messages", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChatInterface />);

    const textarea = screen.getByRole("textbox");
    const sendButton = screen.getByRole("button", { name: /send/i });

    // Button should be disabled when input is empty
    expect(sendButton).toBeDisabled();

    // Count initial messages (should be 0 for new session)
    const initialMessages = screen
      .queryAllByText(/./, {
        selector: '[class*="message"], [class*="Message"]',
      })
      .filter((el) => {
        // Filter to only user messages (not placeholders or other text)
        const text = el.textContent || "";
        return text.trim().length > 0 && !text.includes("Type your message");
      });

    // Try to click (shouldn't do anything since button is disabled)
    await user.click(sendButton);

    // Wait a bit to ensure nothing happened
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Message count should remain the same
    const finalMessages = screen
      .queryAllByText(/./, {
        selector: '[class*="message"], [class*="Message"]',
      })
      .filter((el) => {
        const text = el.textContent || "";
        return text.trim().length > 0 && !text.includes("Type your message");
      });

    expect(finalMessages.length).toBe(initialMessages.length);
  });

  it("does not send message with only whitespace", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChatInterface />);

    const textarea = screen.getByRole("textbox");
    const sendButton = screen.getByRole("button", { name: /send/i });

    await user.type(textarea, "   ");

    // Button should still be disabled (whitespace is trimmed)
    expect(sendButton).toBeDisabled();

    // Count initial messages
    const initialMessages = screen
      .queryAllByText(/./, {
        selector: '[class*="message"], [class*="Message"]',
      })
      .filter((el) => {
        const text = el.textContent || "";
        return text.trim().length > 0 && !text.includes("Type your message");
      });

    // Try to click (shouldn't do anything since button is disabled)
    await user.click(sendButton);

    // Wait a bit to ensure nothing happened
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Message count should remain the same
    const finalMessages = screen
      .queryAllByText(/./, {
        selector: '[class*="message"], [class*="Message"]',
      })
      .filter((el) => {
        const text = el.textContent || "";
        return text.trim().length > 0 && !text.includes("Type your message");
      });

    expect(finalMessages.length).toBe(initialMessages.length);
  });
});
