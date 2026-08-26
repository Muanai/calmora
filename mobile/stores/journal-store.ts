import { create } from "zustand";
import { api } from "../lib/api";

export interface JournalEntry {
  id: string;
  user_id: string;
  encrypted_content: string;
  mood_tag: string | null;
  title: string | null;
  created_at: string;
}

export interface CreateJournalPayload {
  user_id: string;
  encrypted_content: string;
  mood_tag?: string | null;
  title?: string | null;
}

interface JournalStore {
  entries: JournalEntry[];
  isLoading: boolean;
  isSaving: boolean;
  fetchEntries: (
    userId: string,
    getToken: () => Promise<string | null>,
    startDate?: string,
    endDate?: string
  ) => Promise<void>;
  createEntry: (
    payload: CreateJournalPayload,
    getToken: () => Promise<string | null>
  ) => Promise<string | null>;
  getEntriesForDate: (dateStr: string) => JournalEntry[];
}

export const useJournalStore = create<JournalStore>((set, get) => ({
  entries: [],
  isLoading: false,
  isSaving: false,

  fetchEntries: async (userId, getToken, startDate, endDate) => {
    set({ isLoading: true });
    try {
      const token = await getToken();
      const params: Record<string, string> = { user_id: userId };
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const response = await api.get<JournalEntry[]>("/journal/entries", {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ entries: response.data });
    } catch (e) {
      console.error("Failed to fetch journal entries:", e);
    } finally {
      set({ isLoading: false });
    }
  },

  createEntry: async (payload, getToken) => {
    set({ isSaving: true });
    try {
      const token = await getToken();
      const response = await api.post<{ status: string; journal_id: string }>(
        "/journal/entry",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await get().fetchEntries(payload.user_id, getToken);
      return response.data.journal_id;
    } catch (e) {
      console.error("Failed to create journal entry:", e);
      return null;
    } finally {
      set({ isSaving: false });
    }
  },

  getEntriesForDate: (dateStr) => {
    return get().entries.filter((entry) => {
      const entryDate = new Date(entry.created_at);
      const y = entryDate.getFullYear();
      const m = String(entryDate.getMonth() + 1).padStart(2, "0");
      const d = String(entryDate.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}` === dateStr;
    });
  },
}));
