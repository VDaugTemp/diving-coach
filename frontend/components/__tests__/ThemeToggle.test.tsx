import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeToggle from "../ThemeToggle";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Mock useThemeStyles
jest.mock("@/hooks/useThemeStyles", () => ({
  useThemeStyles: () => ({
    hoverBg: "#f0f0f0",
    cardBorder: "1px solid #e0e0e0",
  }),
}));

describe("ThemeToggle", () => {
  it("renders the theme toggle button", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole("button", {
      name: /switch theme/i,
    });
    expect(button).toBeInTheDocument();
  });

  it("displays the current theme icon", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    // Default theme is "light" which should show ☀️
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("☀️");
  });

  it("cycles through themes when clicked", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole("button");

    // Click once - should go from light to hacker
    await user.click(button);
    expect(button).toHaveTextContent("💻");

    // Click again - should go from hacker to designer
    await user.click(button);
    expect(button).toHaveTextContent("🖌️");

    // Click again - should cycle back to light
    await user.click(button);
    expect(button).toHaveTextContent("☀️");
  });

  it("has accessible aria-label that updates with current theme", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", expect.stringContaining("Current: Light"));
  });
});

