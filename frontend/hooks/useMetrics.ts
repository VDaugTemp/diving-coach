/**
 * Hook for managing metrics with mock data
 * Structured to easily replace with backend API calls
 */

import { useState, useEffect } from "react";
import { Metrics } from "@/types";

// Mock data generator
function generateMockMetrics(): Metrics {
  return {
    avgResponseTime: Math.floor(Math.random() * 2000) + 500, // 500-2500ms
    avgWordCount: Math.floor(Math.random() * 200) + 50, // 50-250 words
    sentimentTrend: (["positive", "neutral", "negative"] as const)[
      Math.floor(Math.random() * 3)
    ],
    totalMessages: Math.floor(Math.random() * 500) + 100,
    totalSessions: Math.floor(Math.random() * 50) + 10,
  };
}

export function useMetrics() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Simulate API call with mock data
  useEffect(() => {
    setLoading(true);
    // Simulate network delay
    const timer = setTimeout(() => {
      setMetrics(generateMockMetrics());
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return {
    metrics,
    loading,
  };
}
