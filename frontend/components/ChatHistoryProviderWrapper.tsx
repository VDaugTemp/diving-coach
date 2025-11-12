"use client";

import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ChatHistoryProvider } from "@/contexts/ChatHistoryContext";

function ChatHistoryProviderInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Only use sessionId from URL if we're on the home page
  const sessionId = pathname === "/" ? searchParams.get("session") : null;

  return (
    <ChatHistoryProvider sessionId={sessionId}>
      {children}
    </ChatHistoryProvider>
  );
}

export function ChatHistoryProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={children}>
      <ChatHistoryProviderInner>{children}</ChatHistoryProviderInner>
    </Suspense>
  );
}

