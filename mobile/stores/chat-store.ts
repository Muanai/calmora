import { create } from "zustand";
import { SSEClient } from "../lib/sse";

export type Role = "user" | "ai";

export interface ChatMessage {
  id: string;
  role: Role;
  text: string;
}

interface ChatStore {
  messages: ChatMessage[];
  isStreaming: boolean;
  sseClient: SSEClient | null;
  addMessage: (msg: ChatMessage) => void;
  updateLastMessage: (textChunk: string) => void;
  sendMessage: (text: string, userId: string, getToken: () => Promise<string | null>) => Promise<void>;
  stopStreaming: () => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isStreaming: false,
  sseClient: null,

  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),

  updateLastMessage: (textChunk) =>
    set((state) => {
      const messages = [...state.messages];
      if (messages.length > 0 && messages[messages.length - 1].role === "ai") {
        messages[messages.length - 1].text += textChunk;
      }
      return { messages };
    }),

  sendMessage: async (text, userId, getToken) => {
    const { addMessage, updateLastMessage, stopStreaming } = get();

    // Hentikan jika ada stream yang sedang berjalan
    stopStreaming();

    // Tambah pesan user
    const userMsgId = Date.now().toString();
    addMessage({ id: userMsgId, role: "user", text });

    // Tambah placeholder pesan AI
    const aiMsgId = (Date.now() + 1).toString();
    addMessage({ id: aiMsgId, role: "ai", text: "" });

    set({ isStreaming: true });

    const client = new SSEClient();
    set({ sseClient: client });

    try {
      await client.stream({
        url: "/api/v1/chat/stream",
        method: "POST",
        body: { user_id: userId, message: text, intensity_level: "menengah" }, // default intensity level for now
        getToken,
        onMessage: (data) => {
          if (data === "[DONE]") {
            stopStreaming();
            return;
          }
          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              updateLastMessage(parsed.text);
            }
          } catch (e) {
            updateLastMessage(data);
          }
        },
        onError: (error) => {
          console.error("SSE Error:", error);
          set({ isStreaming: false });
        },
        onEnd: () => {
          set({ isStreaming: false });
        },
      });
    } catch (error) {
      console.error("Gagal memulai SSE:", error);
      set({ isStreaming: false });
    }
  },

  stopStreaming: () => {
    const { sseClient } = get();
    if (sseClient) {
      sseClient.close();
      set({ sseClient: null, isStreaming: false });
    }
  },

  clearMessages: () => set({ messages: [], isStreaming: false }),
}));
