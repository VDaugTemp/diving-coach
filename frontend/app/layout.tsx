import type { Metadata } from "next";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ChatHistoryProviderWrapper } from "@/components/ChatHistoryProviderWrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Chat Application",
  description: "A chat application powered by OpenAI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <ChatHistoryProviderWrapper>
            {children}
          </ChatHistoryProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}

