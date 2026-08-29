import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { api } from "../lib/api";

export interface Mission {
  id: string;
  title: string;
  description: string;
  long_description: string;
  warning_text: string;
  time: string;
  level: "Easy" | "Medium" | "Hard" | "Jurnal";
  badge_text: string;
  action_type: string;
  is_completed: boolean;
}

const STORAGE_KEY = "mission_daily_state";

// Helper to safely get item depending on platform
const getStorageItem = async (key: string): Promise<string | null> => {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem(key);
    }
    return null;
  }
  return await SecureStore.getItemAsync(key);
};

// Helper to safely set item depending on platform
const setStorageItem = async (key: string, value: string): Promise<void> => {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, value);
    }
    return;
  }
  await SecureStore.setItemAsync(key, value);
};

const STATIC_MISSIONS: Omit<Mission, "is_completed">[] = [
  {
    id: "mission_journal",
    title: "Tuangkan Ceritamu Hari Ini",
    description: "Tuliskan satu hal yang bikin kepalamu pusing hari ini.",
    long_description:
      "Tuangkan ceritamu hari ini. Kepalamu berhak mendapatkan ruang yang lebih lapang hari ini.",
    warning_text: "Tidak perlu takut, tidak ada orang lain yang tahu kondisimu hari ini",
    time: "Sesukamu",
    level: "Jurnal",
    badge_text: "Jurnal",
    action_type: "mission_journal",
  },
  {
    id: "mission_open_window",
    title: "Buka Sedikit Celah Udara",
    description: "Coba buka tirai atau jendela kamar selebar satu jengkal saja. Biarkan sedikit cahaya baru masuk menyapamu.",
    long_description:
      "Buka jendela kamarmu selama 2 menit. Rasakan udara luar yang masuk. Kamu tidak perlu pergi ke mana-mana.",
    warning_text: "Kamu tidak perlu keluar. Cukup di dekat jendela saja, di dalam kamar.",
    time: "2 menit",
    level: "Easy",
    badge_text: "Easy",
    action_type: "mission_open_window",
  },
  {
    id: "mission_door",
    title: "Berdiri di Depan Pintu",
    description: "Coba melangkah pelan mendekati pintu kamarmu.",
    long_description:
      "Coba berdiri santai di depannya selama 30 detik. Pintunya boleh tetap tertutup atau sedikit terbuka, senyamannya kamu",
    warning_text: "Pintu hanya batas saja dan kamu bisa kembali kapan saja",
    time: "30 detik",
    level: "Medium",
    badge_text: "Medium",
    action_type: "mission_stand_at_door",
  },
  {
    id: "mission_outside",
    title: "10 Langkah dari Depan Pintu",
    description: "Coba berjalan sejenak ke luar area kamar tidurmu.",
    long_description:
      "Kamu sudah sangat hebat sampai di titik ini. Yuk, coba buka pintu dan berjalan sejauh 10 langkah dari depan pintu.",
    warning_text: "Tidak ada yang menghakimi kamu, satu langkah saja sudah luar biasa.",
    time: "Sesukamu",
    level: "Hard",
    badge_text: "Hard",
    action_type: "mission_10_steps_outside",
  },
];

interface MissionPersistedState {
  date: string;
  completedIds: string[];
}

interface MissionStore {
  missions: Mission[];
  isLoading: boolean;
  fetchMissions: (userId: string, getToken: () => Promise<string | null>) => Promise<void>;
  completeMission: (missionId: string, userId: string, getToken: () => Promise<string | null>) => Promise<void>;
}

const getTodayString = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
};

const buildMissions = (completedIds: string[]): Mission[] =>
  STATIC_MISSIONS.map((m) => ({ ...m, is_completed: completedIds.includes(m.id) }));

export const useMissionStore = create<MissionStore>((set, get) => ({
  missions: buildMissions([]),
  isLoading: false,

  fetchMissions: async (_userId, _getToken) => {
    set({ isLoading: true });
    try {
      const raw = await getStorageItem(STORAGE_KEY);
      const today = getTodayString();

      if (raw) {
        const parsed: MissionPersistedState = JSON.parse(raw);
        if (parsed.date === today) {
          set({ missions: buildMissions(parsed.completedIds) });
          return;
        }
      }

      const fresh: MissionPersistedState = { date: today, completedIds: [] };
      await setStorageItem(STORAGE_KEY, JSON.stringify(fresh));
      set({ missions: buildMissions([]) });
    } catch (e) {
      console.error("Failed to load missions:", e);
      set({ missions: buildMissions([]) });
    } finally {
      set({ isLoading: false });
    }
  },

  completeMission: async (missionId, userId, getToken) => {
    const mission = get().missions.find((m) => m.id === missionId);
    if (!mission) return;

    // Optimistic update
    set((state) => ({
      missions: state.missions.map((m) =>
        m.id === missionId ? { ...m, is_completed: true } : m
      ),
    }));

    try {
      // 1. Send to backend
      const token = await getToken();
      await api.post(
        "/actions/grounding",
        {
          user_id: userId,
          action_type: mission.action_type,
          duration_seconds: 300,
          completed: true,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // 2. Persist locally
      const raw = await getStorageItem(STORAGE_KEY);
      const today = getTodayString();
      const parsed: MissionPersistedState = raw
        ? JSON.parse(raw)
        : { date: today, completedIds: [] };

      if (!parsed.completedIds.includes(missionId)) {
        parsed.completedIds.push(missionId);
      }
      parsed.date = today;
      await setStorageItem(STORAGE_KEY, JSON.stringify(parsed));
    } catch (e) {
      console.error("Failed to persist mission completion:", e);
      // Revert optimistic update on failure
      set((state) => ({
        missions: state.missions.map((m) =>
          m.id === missionId ? { ...m, is_completed: false } : m
        ),
      }));
    }
  },
}));
