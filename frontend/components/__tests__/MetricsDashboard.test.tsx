import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import MetricsDashboard from "../MetricsDashboard";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Mock useMetrics hook
const mockMetrics = {
  avgResponseTime: 1200,
  avgWordCount: 150,
  sentimentTrend: "positive" as const,
  totalMessages: 250,
  totalSessions: 15,
};

jest.mock("@/hooks/useMetrics", () => ({
  useMetrics: () => ({
    metrics: mockMetrics,
    loading: false,
  }),
}));

// Mock useThemeStyles
jest.mock("@/hooks/useThemeStyles", () => ({
  useThemeStyles: () => ({
    surface: "#ffffff",
    border: "#e0e0e0",
    text: "#000000",
    textSecondary: "#666666",
    primary: "#0070f3",
    cardBg: "#f5f5f5",
    backdropBlur: "blur(10px)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    cardBoxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    fontFamily: "system-ui",
    chartLine: "#0070f3",
    chartBar: "#00d4ff",
    cardColors: {
      primary: { bg: "#f0f0f0", value: "#0070f3", glow: "#0070f3" },
      secondary: { bg: "#f0f0f0", value: "#00d4ff", glow: "#00d4ff" },
      tertiary: { bg: "#f0f0f0", value: "#ff6b6b", glow: "#ff6b6b" },
      quaternary: { bg: "#f0f0f0", value: "#51cf66", glow: "#51cf66" },
    },
  }),
}));

// Mock recharts to avoid rendering issues in tests
jest.mock("recharts", () => ({
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="line-chart">{children}</div>
  ),
  Line: () => <div data-testid="line" />,
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  Cell: () => <div data-testid="cell" />,
}));

describe("MetricsDashboard", () => {
  it("renders the dashboard title", () => {
    render(
      <ThemeProvider>
        <MetricsDashboard />
      </ThemeProvider>
    );

    expect(screen.getByText("Metrics Dashboard")).toBeInTheDocument();
  });

  it("displays all metric cards with correct labels", () => {
    render(
      <ThemeProvider>
        <MetricsDashboard />
      </ThemeProvider>
    );

    expect(screen.getByText("Avg Response Time")).toBeInTheDocument();
    expect(screen.getByText("Avg Word Count")).toBeInTheDocument();
    expect(screen.getByText("Total Messages")).toBeInTheDocument();
    expect(screen.getByText("Total Sessions")).toBeInTheDocument();
  });

  it("displays metric values", async () => {
    render(
      <ThemeProvider>
        <MetricsDashboard />
      </ThemeProvider>
    );

    // Wait for AnimatedNumber to finish animating and check values
    // Numbers are formatted with toLocaleString and may be split across elements
    await waitFor(
      () => {
        // Get all text content and check for our expected values
        const allText = document.body.textContent || "";
        // Check for 1200 (may be formatted as 1,200 or 1200, and may have "ms" suffix)
        expect(allText).toMatch(/1[,.]?200/);
        // Check for 150 (may be adjacent to text like "Count150")
        expect(allText).toMatch(/(?:[^\d]|^)150(?:[^\d]|$)/);
        // Check for 250 (may be adjacent to text)
        expect(allText).toMatch(/(?:[^\d]|^)250(?:[^\d]|$)/);
        // Check for 15 (may be adjacent to text, but be careful not to match 150 or 250)
        expect(allText).toMatch(/(?:[^\d]|^)15(?:[^\d]|$)/);
      },
      { timeout: 2000 }
    );
  });

  it("displays the sentiment trend", () => {
    render(
      <ThemeProvider>
        <MetricsDashboard />
      </ThemeProvider>
    );

    expect(screen.getByText("Sentiment Trend")).toBeInTheDocument();
    expect(screen.getByText("positive")).toBeInTheDocument();
  });

  it("displays chart section headers", () => {
    render(
      <ThemeProvider>
        <MetricsDashboard />
      </ThemeProvider>
    );

    expect(screen.getByText("Response Time Trend")).toBeInTheDocument();
    expect(screen.getByText("Word Count Trend")).toBeInTheDocument();
  });

  it("renders charts", () => {
    render(
      <ThemeProvider>
        <MetricsDashboard />
      </ThemeProvider>
    );

    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("displays last updated timestamp", () => {
    render(
      <ThemeProvider>
        <MetricsDashboard />
      </ThemeProvider>
    );

    expect(screen.getByText(/Last updated:/i)).toBeInTheDocument();
  });

  it("shows loading state when metrics are loading", () => {
    jest.spyOn(require("@/hooks/useMetrics"), "useMetrics").mockReturnValue({
      metrics: null,
      loading: true,
    });

    render(
      <ThemeProvider>
        <MetricsDashboard />
      </ThemeProvider>
    );

    expect(screen.getByText("Loading metrics...")).toBeInTheDocument();
  });

  it("shows no metrics message when metrics are null", () => {
    jest.spyOn(require("@/hooks/useMetrics"), "useMetrics").mockReturnValue({
      metrics: null,
      loading: false,
    });

    render(
      <ThemeProvider>
        <MetricsDashboard />
      </ThemeProvider>
    );

    expect(screen.getByText("No metrics available")).toBeInTheDocument();
  });
});

