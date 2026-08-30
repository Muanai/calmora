import { create } from "zustand";
import { api } from "../lib/api";

export interface GroundingSenses {
  lihat: string[];
  sentuh: string[];
  dengar: string[];
  cium: string[];
  rasa: string[];
}

export interface GroundingMission {
  level: "Easy" | "Medium" | "Hard";
  action_type: string;
  senses: GroundingSenses;
  is_completed: boolean;
  is_journal_completed: boolean;
}

interface GroundingStore {
  grounding: GroundingMission | null;
  isLoading: boolean;
  fetchGrounding: (userId: string, getToken: () => Promise<string | null>) => Promise<void>;
  completeGrounding: (userId: string, getToken: () => Promise<string | null>) => Promise<void>;
}

export const useGroundingStore = create<GroundingStore>((set, get) => ({
  grounding: null,
  isLoading: false,

  fetchGrounding: async (userId, getToken) => {
    set({ isLoading: true });
    try {
      const token = await getToken();
      const response = await api.get<GroundingMission>("/missions/today", {
        params: { user_id: userId },
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ grounding: response.data });
    } catch (e) {
      console.error("Failed to fetch grounding:", e);
    } finally {
      set({ isLoading: false });
    }
  },

  completeGrounding: async (userId, getToken) => {
    const actionType = get().grounding?.action_type;
    set((state) => ({
      grounding: state.grounding ? { ...state.grounding, is_completed: true } : null,
    }));
    try {
      const token = await getToken();
      await api.post("/missions/complete", null, {
        params: {
          user_id: userId,
          ...(actionType ? { action_type: actionType } : {}),
        },
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (e) {
      console.error("Failed to complete grounding:", e);
      set((state) => ({
        grounding: state.grounding ? { ...state.grounding, is_completed: false } : null,
      }));
    }
  },
}));

