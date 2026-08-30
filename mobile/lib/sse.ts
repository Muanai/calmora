import { Platform } from "react-native";
import EventSource from "react-native-sse";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "https://p01--calmora--y7mbybhlhn8f.code.run";

export type SSEOptions = {
  url: string;
  method?: string;
  body?: any;
  onMessage: (data: string) => void;
  onError?: (error: any) => void;
  onEnd?: () => void;
  getToken?: () => Promise<string | null>;
};

export class SSEClient {
  private es: EventSource | null = null;
  private abortController: AbortController | null = null;

  async stream({ url, method = "POST", body, onMessage, onError, onEnd, getToken: getTokenFn }: SSEOptions) {
    const token = getTokenFn ? await getTokenFn() : null;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    if (Platform.OS === "web") {
      await this._streamWithFetch({ url, method, body, headers, onMessage, onError, onEnd });
    } else {
      this._streamWithSSE({ url, method, body, headers, onMessage, onError, onEnd });
    }
  }

  private async _streamWithFetch({
    url,
    method,
    body,
    headers,
    onMessage,
    onError,
    onEnd,
  }: {
    url: string;
    method: string;
    body: any;
    headers: Record<string, string>;
    onMessage: (data: string) => void;
    onError?: (error: any) => void;
    onEnd?: () => void;
  }) {
    this.abortController = new AbortController();
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: this.abortController.signal,
      });

      if (!response.ok || !response.body) {
        if (onError) onError({ type: "error", status: response.status });
        if (onEnd) onEnd();
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (value) {
          buffer += decoder.decode(value, { stream: !done });
        }

        const lines = buffer.split("\n");
        buffer = done ? "" : (lines.pop() ?? "");

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data: ")) {
            const data = trimmed.slice(6);
            if (data) onMessage(data);
          }
        }

        if (done) break;
      }

      // Flush sisa buffer jika ada (chunk terakhir tanpa newline)
      if (buffer.trim().startsWith("data: ")) {
        const data = buffer.trim().slice(6);
        if (data) onMessage(data);
      }
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      if (onError) onError(err);
    } finally {
      if (onEnd) onEnd();
    }
  }

  private _streamWithSSE({
    url,
    method,
    body,
    headers,
    onMessage,
    onError,
    onEnd,
  }: {
    url: string;
    method: string;
    body: any;
    headers: Record<string, string>;
    onMessage: (data: string) => void;
    onError?: (error: any) => void;
    onEnd?: () => void;
  }) {
    this.es = new EventSource(`${API_BASE_URL}${url}`, {
      headers,
      method,
      body: body ? JSON.stringify(body) : undefined,
      lineEndingCharacter: "\r\n",
    });

    this.es?.addEventListener("message", (event: any) => {
      if (event.data) {
        onMessage(event.data);
      }
    });

    this.es?.addEventListener("error", (error: any) => {
      if (onError) onError(error);
      this.close();
      if (onEnd) onEnd();
    });

    this.es?.addEventListener("close", () => {
      this.close();
      if (onEnd) onEnd();
    });
  }

  close() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    if (this.es) {
      if (typeof (this.es as any).removeAllEventListeners === "function") {
        (this.es as any).removeAllEventListeners();
      }
      this.es.close();
      this.es = null;
    }
  }
}
