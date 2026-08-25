import { create } from "zustand";
import { api } from "../lib/api";

export interface UserProfile {
  id: string;
  email: string;
  nama: string | null;
  umur: string | null;
  agama: string | null;
  kondisi: string | null;
  asal_daerah: string | null;
  jenis_kelamin: string | null;
}

export interface UserProfileUpdate {
  nama?: string | null;
  umur?: string | null;
  agama?: string | null;
  kondisi?: string | null;
  asal_daerah?: string | null;
  jenis_kelamin?: string | null;
}

interface UserStore {
  profile: UserProfile | null;
  isLoading: boolean;
  isSaving: boolean;
  fetchProfile: (userId: string, getToken: () => Promise<string | null>) => Promise<void>;
  updateProfile: (userId: string, data: UserProfileUpdate, getToken: () => Promise<string | null>) => Promise<boolean>;
}

export const useUserStore = create<UserStore>((set) => ({
  profile: null,
  isLoading: false,
  isSaving: false,

  fetchProfile: async (userId, getToken) => {
    set({ isLoading: true });
    try {
      const token = await getToken();
      const response = await api.get<UserProfile>(`/user/profile?user_id=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ profile: response.data });
    } catch (e) {
      console.error("Failed to fetch profile:", e);
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (userId, data, getToken) => {
    set({ isSaving: true });
    try {
      const token = await getToken();
      await api.put(
        `/user/profile`,
        { user_id: userId, ...data },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set((state) => ({
        profile: state.profile ? { ...state.profile, ...data } : null,
      }));
      return true;
    } catch (e) {
      console.error("Failed to update profile:", e);
      return false;
    } finally {
      set({ isSaving: false });
    }
  },
}));
