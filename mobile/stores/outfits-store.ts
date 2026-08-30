import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OutfitsState {
  equippedHat: string | null;
  equippedShirt: string | null;
  toggleHat: (hatId: string) => void;
  toggleShirt: (shirtId: string) => void;
}

export const useOutfitsStore = create<OutfitsState>()(
  persist(
    (set, get) => ({
      equippedHat: null,
      equippedShirt: null,
      toggleHat: (hatId: string) => {
        set({ equippedHat: get().equippedHat === hatId ? null : hatId });
      },
      toggleShirt: (shirtId: string) => {
        set({ equippedShirt: get().equippedShirt === shirtId ? null : shirtId });
      },
    }),
    {
      name: 'outfits-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
