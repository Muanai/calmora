import { create } from "zustand";
import { api } from "../lib/api";

export interface AiMemory {
  id: string;
  memory_text: string;
  source: "ai_generated" | "user_provided";
  created_at: string;
}

interface MemoryStore {
  memories: AiMemory[];
  isLoading: boolean;
  fetchMemories: (userId: string, getToken: () => Promise<string | null>) => Promise<void>;
  deleteMemory: (memoryId: string, userId: string, getToken: () => Promise<string | null>) => Promise<void>;
  clearAllMemories: (userId: string, getToken: () => Promise<string | null>) => Promise<void>;
}

export const useMemoryStore = create<MemoryStore>((set) => ({
  memories: [],
  isLoading: false,

  fetchMemories: async (userId, getToken) => {
    set({ isLoading: true });
    try {
      const token = await getToken();
      const response = await api.get<AiMemory[]>(`/chat/memories?user_id=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ memories: response.data });
    } catch (e) {
      console.error("Failed to fetch memories:", e);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteMemory: async (memoryId, userId, getToken) => {
    try {
      const token = await getToken();
      await api.delete(`/chat/memories/${memoryId}?user_id=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        memories: state.memories.filter((m) => m.id !== memoryId),
      }));
    } catch (e) {
      console.error("Failed to delete memory:", e);
    }
  },

  clearAllMemories: async (userId, getToken) => {
    try {
      const token = await getToken();
      await api.delete(`/chat/memories?user_id=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ memories: [] });
    } catch (e) {
      console.error("Failed to clear memories:", e);
    }
  },
}));
