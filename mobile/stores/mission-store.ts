import { create } from "zustand";
import { api } from "../lib/api";

export interface Mission {
  id: string;
  level: "Easy" | "Medium" | "Hard";
  title: string;
  description: string;
  time: string;
  long_description: string;
  warning_text: string;
  is_completed: boolean;
}

interface MissionStore {
  missions: Mission[];
  isLoading: boolean;
  fetchMissions: (userId: string, getToken: () => Promise<string | null>) => Promise<void>;
  completeMission: (missionId: string, userId: string, getToken: () => Promise<string | null>) => Promise<void>;
}

export const useMissionStore = create<MissionStore>((set, get) => ({
  missions: [],
  isLoading: false,

  fetchMissions: async (userId, getToken) => {
    set({ isLoading: true });
    try {
      const token = await getToken();
      const response = await api.get<Mission[]>("/missions/today", {
        params: { user_id: userId },
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ missions: response.data });
    } catch (e) {
      console.error("Failed to fetch missions:", e);
    } finally {
      set({ isLoading: false });
    }
  },

  completeMission: async (missionId, userId, getToken) => {
    set((state) => ({
      missions: state.missions.map((m) =>
        m.id === missionId ? { ...m, is_completed: true } : m
      ),
    }));
    try {
      const token = await getToken();
      await api.post(
        `/missions/${missionId}/complete`,
        null,
        {
          params: { user_id: userId },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (e) {
      console.error("Failed to complete mission:", e);
      set((state) => ({
        missions: state.missions.map((m) =>
          m.id === missionId ? { ...m, is_completed: false } : m
        ),
      }));
    }
  },
}));
