/**
 * Hook for fetching RAG system statistics
 */

import { useState, useEffect } from "react";
import { RAGStats } from "@/types";
import { fetchRAGStats } from "@/utils/api";

export function useRAGStats(refreshInterval: number = 30000) {
  const [ragStats, setRagStats] = useState<RAGStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRAGStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const stats = await fetchRAGStats();
        setRagStats(stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load RAG stats");
        console.error("Error loading RAG stats:", err);
      } finally {
        setLoading(false);
      }
    };

    // Load immediately
    loadRAGStats();

    // Set up periodic refresh if interval is provided
    if (refreshInterval > 0) {
      const interval = setInterval(loadRAGStats, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval]);

  return {
    ragStats,
    loading,
    error,
  };
}

