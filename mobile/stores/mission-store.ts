import { create } from "zustand";
import { api } from "../lib/api";

export interface MissionSenses {
  lihat: string[];
  sentuh: string[];
  dengar: string[];
  cium: string[];
  rasa: string[];
}

export interface Mission {
  level: "Easy" | "Medium" | "Hard";
  action_type: string;
  senses: MissionSenses;
  is_completed: boolean;
}

interface MissionStore {
  mission: Mission | null;
  isLoading: boolean;
  fetchMission: (userId: string, getToken: () => Promise<string | null>) => Promise<void>;
  completeMission: (userId: string, getToken: () => Promise<string | null>) => Promise<void>;
}

export const useMissionStore = create<MissionStore>((set, get) => ({
  mission: null,
  isLoading: false,

  fetchMission: async (userId, getToken) => {
    set({ isLoading: true });
    try {
      const token = await getToken();
      const response = await api.get<Mission>("/missions/today", {
        params: { user_id: userId },
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ mission: response.data });
    } catch (e) {
      console.error("Failed to fetch mission:", e);
    } finally {
      set({ isLoading: false });
    }
  },

  completeMission: async (userId, getToken) => {
    set((state) => ({
      mission: state.mission ? { ...state.mission, is_completed: true } : null,
    }));
    try {
      const token = await getToken();
      await api.post("/missions/complete", null, {
        params: { user_id: userId },
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (e) {
      console.error("Failed to complete mission:", e);
      set((state) => ({
        mission: state.mission ? { ...state.mission, is_completed: false } : null,
      }));
    }
  },
}));
