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
    <ChatHistoryProvider sessionId={sessionId}>{children}</ChatHistoryProvider>
  );
}

export function ChatHistoryProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // Always wrap children in provider with default sessionId
  // This ensures the provider is available during SSR/build-time when Suspense fallback renders
  // The inner provider will update the sessionId when search params become available
  return (
    <ChatHistoryProvider sessionId={null}>
      <Suspense fallback={children}>
        <ChatHistoryProviderInner>{children}</ChatHistoryProviderInner>
      </Suspense>
    </ChatHistoryProvider>
  );
}
