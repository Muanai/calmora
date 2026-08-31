import { create } from "zustand";
import { api } from "../lib/api";
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
  isLoadingHistory: boolean;
  sseClient: SSEClient | null;
  addMessage: (msg: ChatMessage) => void;
  updateLastMessage: (textChunk: string) => void;
  fetchHistory: (userId: string, getToken: () => Promise<string | null>) => Promise<void>;
  sendMessage: (text: string, userId: string, getToken: () => Promise<string | null>) => Promise<void>;
  stopStreaming: () => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isStreaming: false,
  isLoadingHistory: false,
  sseClient: null,

  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),

  updateLastMessage: (textChunk) =>
    set((state) => {
      const messages = [...state.messages];
      const lastIndex = messages.length - 1;
      if (lastIndex >= 0 && messages[lastIndex].role === "ai") {
        messages[lastIndex] = {
          ...messages[lastIndex],
          text: messages[lastIndex].text + textChunk,
        };
      }
      return { messages };
    }),

  fetchHistory: async (userId, getToken) => {
    set({ isLoadingHistory: true });
    try {
      const token = await getToken();
      const response = await api.get<{ id: string; role: string; content: string; created_at: string }[]>(
        `/chat/history?user_id=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const messages: ChatMessage[] = response.data.map((item) => ({
        id: item.id,
        role: item.role === "model" ? "ai" : "user",
        text: item.content,
      }));
      set({ messages });
    } catch (e) {
      console.error("Failed to fetch chat history:", e);
    } finally {
      set({ isLoadingHistory: false });
    }
  },

  sendMessage: async (text, userId, getToken) => {
    const { addMessage, updateLastMessage, stopStreaming } = get();

    stopStreaming();

    const userMsgId = Date.now().toString();
    addMessage({ id: userMsgId, role: "user", text });

    const aiMsgId = (Date.now() + 1).toString();
    addMessage({ id: aiMsgId, role: "ai", text: "" });

    set({ isStreaming: true });

    const client = new SSEClient();
    set({ sseClient: client });

    try {
      await client.stream({
        url: "/chat/stream",
        method: "POST",
        body: { user_id: userId, message: text, intensity_level: "menengah" },
        getToken,
        onMessage: (data) => {
          if (data === "[DONE]") {
            stopStreaming();
            return;
          }
          try {
            const parsed = JSON.parse(data);
            if (parsed.text && parsed.text !== "[DONE]") {
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
