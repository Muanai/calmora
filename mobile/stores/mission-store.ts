import { create } from "zustand";
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
    action_type: "micro_step_lv1",
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
    action_type: "micro_step_lv2",
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
    action_type: "micro_step_lv3",
  },
];

const buildMissions = (completedActionTypes: string[]): Mission[] =>
  STATIC_MISSIONS.map((m) => ({
    ...m,
    is_completed: completedActionTypes.includes(m.action_type),
  }));

interface MissionStore {
  missions: Mission[];
  isLoading: boolean;
  fetchMissions: (userId: string, getToken: () => Promise<string | null>) => Promise<void>;
  completeMission: (missionId: string, userId: string, getToken: () => Promise<string | null>) => Promise<void>;
}

export const useMissionStore = create<MissionStore>((set, get) => ({
  missions: buildMissions([]),
  isLoading: false,

  fetchMissions: async (userId, getToken) => {
    set({ isLoading: true });
    try {
      const token = await getToken();
      const res = await api.get(`/missions/today?user_id=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data as { is_completed: boolean; action_type: string; is_journal_completed: boolean; completed_micro_steps?: string[] };
      const completedActionTypes = data.is_completed ? [data.action_type] : [];

      if (data.is_journal_completed) {
        completedActionTypes.push("mission_journal");
      }
      
      if (data.completed_micro_steps && Array.isArray(data.completed_micro_steps)) {
        completedActionTypes.push(...data.completed_micro_steps);
      }

      set({ missions: buildMissions(completedActionTypes) });
    } catch (e) {
      console.error("Failed to fetch missions:", e);
      set({ missions: buildMissions([]) });
    } finally {
      set({ isLoading: false });
    }
  },

  completeMission: async (missionId, userId, getToken) => {
    const mission = get().missions.find((m) => m.id === missionId);
    if (!mission) return;

    set((state) => ({
      missions: state.missions.map((m) =>
        m.id === missionId ? { ...m, is_completed: true } : m
      ),
    }));

    try {
      const token = await getToken();
      await api.post(
        `/missions/complete?user_id=${userId}&action_type=${mission.action_type}`,
        {},
        {
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

