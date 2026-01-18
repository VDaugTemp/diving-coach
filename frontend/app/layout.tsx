import type { Metadata } from "next";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ChatHistoryProviderWrapper } from "@/components/ChatHistoryProviderWrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "Diving Coach",
  description: "Your personal diving coach for scuba and freediving education, safety, and training principles",
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

