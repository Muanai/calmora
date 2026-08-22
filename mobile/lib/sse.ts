import { Platform } from "react-native";
import EventSource from "react-native-sse";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://127.0.0.1:8000";

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

  async stream({ url, method = "POST", body, onMessage, onError, onEnd, getToken: getTokenFn }: SSEOptions) {
    const token = getTokenFn ? await getTokenFn() : null;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Initialize react-native-sse EventSource
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
    if (this.es) {
      if (typeof (this.es as any).removeAllEventListeners === "function") {
        (this.es as any).removeAllEventListeners();
      }
      this.es.close();
      this.es = null;
    }
  }
}
