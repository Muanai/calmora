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
  userBio: string;
  isSavingBio: boolean;
  fetchMemories: (userId: string, getToken: () => Promise<string | null>) => Promise<void>;
  deleteMemory: (memoryId: string, userId: string, getToken: () => Promise<string | null>) => Promise<void>;
  clearAllMemories: (userId: string, getToken: () => Promise<string | null>) => Promise<void>;
  fetchBio: (userId: string, getToken: () => Promise<string | null>) => Promise<void>;
  saveBio: (userId: string, bio: string, getToken: () => Promise<string | null>) => Promise<void>;
}

export const useMemoryStore = create<MemoryStore>((set) => ({
  memories: [],
  isLoading: false,
  userBio: "",
  isSavingBio: false,

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

  fetchBio: async (userId, getToken) => {
    try {
      const token = await getToken();
      const response = await api.get<{ bio: string | null }>(`/chat/bio?user_id=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ userBio: response.data.bio ?? "" });
    } catch (e) {
      console.error("Failed to fetch bio:", e);
    }
  },

  saveBio: async (userId, bio, getToken) => {
    set({ isSavingBio: true });
    try {
      const token = await getToken();
      await api.put(
        `/chat/bio`,
        { user_id: userId, bio },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({ userBio: bio });
    } catch (e) {
      console.error("Failed to save bio:", e);
    } finally {
      set({ isSavingBio: false });
    }
  },
}));
