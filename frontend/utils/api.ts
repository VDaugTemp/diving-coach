/**
 * API utilities for communicating with the FastAPI backend
 */

// Get API base URL - use relative URLs in browser (same domain), or explicit env var
const getApiBaseUrl = (): string => {
  // If explicitly set via environment variable, use it
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // In browser (client-side), use relative URLs for same-origin requests
  // This works because both frontend and backend are on the same Vercel domain
  // Check at runtime, not module load time
  if (typeof window !== "undefined") {
    return ""; // Empty string means relative URLs
  }
  
  // Server-side rendering fallback to localhost
  return "http://localhost:8000";
};

export interface ChatRequest {
  user_message: string;
  model?: string;
  template?: "default" | "beginner" | "advanced";
}

/**
 * Stream chat response from the API
 */
export async function streamChat(
  request: ChatRequest,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: string) => void
) {
  try {
    // Get API base URL at runtime (not module load time)
    const baseUrl = getApiBaseUrl();
    const apiUrl = baseUrl ? `${baseUrl}/api/chat` : "/api/chat";
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.text();
      onError(error || "Failed to get response from API");
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      onError("No response body");
      return;
    }

    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      if (chunk) {
        onChunk(chunk);
      }
    }

    onComplete();
  } catch (error) {
    onError(
      error instanceof Error ? error.message : "Unknown error occurred"
    );
  }
}

/**
 * Health check for the API
 */
export async function checkHealth(): Promise<boolean> {
  try {
    // Get API base URL at runtime (not module load time)
    const baseUrl = getApiBaseUrl();
    const apiUrl = baseUrl ? `${baseUrl}/api/health` : "/api/health";
    const response = await fetch(apiUrl);
    return response.ok;
  } catch {
    return false;
  }
}

