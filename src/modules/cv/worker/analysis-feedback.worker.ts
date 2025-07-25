// analysis-feedback.worker.ts

interface PollMessage {
  analysisId: string;
  apiBaseUrl: string;
  intervalMs?: number;
}

let intervalId: ReturnType<typeof setInterval> | null = null;

self.onmessage = async (event: MessageEvent<PollMessage>) => {
  const { analysisId, apiBaseUrl, intervalMs = 3000 } = event.data;
  const endpoint = `${apiBaseUrl.replace(/\/$/, '')}/api/cv/${analysisId}/feedback`;

  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }

  intervalId = setInterval(async () => {
    try {
      const response = await fetch(endpoint, { credentials: 'include' });
      if (response.status === 404) {
        // Not ready yet
        return;
      }
      if (response.ok) {
        const data = await response.json();
        // Post feedback to main thread
        self.postMessage({ type: 'feedback', data });
        clearInterval(intervalId!);
        intervalId = null;
        self.close(); // Terminate the worker after feedback is found
      } else {
        // Some other error, stop polling
        self.postMessage({ type: 'error', error: `Status: ${response.status}` });
        clearInterval(intervalId!);
        intervalId = null;
      }
    } catch (err) {
      self.postMessage({ type: 'error', error: err instanceof Error ? err.message : String(err) });
      clearInterval(intervalId!);
      intervalId = null;
    }
  }, intervalMs);
};
