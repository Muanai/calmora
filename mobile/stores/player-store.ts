import { create } from 'zustand';
import { Audio } from 'expo-av';

interface TrackData {
  title: string;
  subtitle: string;
  uri: string;
}

interface PlayerState {
  sound: Audio.Sound | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  isShuffle: boolean;
  repeatMode: number;
  isMinimized: boolean;
  trackData: TrackData | null;
  
  setSound: (sound: Audio.Sound | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setPosition: (position: number) => void;
  setDuration: (duration: number) => void;
  setIsShuffle: (isShuffle: boolean) => void;
  setRepeatMode: (repeatMode: number) => void;
  setIsMinimized: (isMinimized: boolean) => void;
  setTrackData: (data: TrackData | null) => void;
  
  loadAudio: (uri: string, trackData: TrackData) => Promise<void>;
  unloadAudio: () => Promise<void>;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  sound: null,
  isPlaying: false,
  position: 0,
  duration: 1,
  isShuffle: false,
  repeatMode: 0,
  isMinimized: false,
  trackData: null,
  
  setSound: (sound) => set({ sound }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setPosition: (position) => set({ position }),
  setDuration: (duration) => set({ duration }),
  setIsShuffle: (isShuffle) => set({ isShuffle }),
  setRepeatMode: (repeatMode) => set({ repeatMode }),
  setIsMinimized: (isMinimized) => set({ isMinimized }),
  setTrackData: (trackData) => set({ trackData }),

  loadAudio: async (uri: string, trackData: TrackData) => {
    const { sound: currentSound } = get();
    if (currentSound) {
      await currentSound.unloadAsync();
    }

    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });

      const { sound: audioSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true, progressUpdateIntervalMillis: 1000 }
      );
      
      set({ sound: audioSound, trackData, isPlaying: true });
      
      audioSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          set({ 
            position: status.positionMillis,
            duration: status.durationMillis || 1
          });
          
          if (status.didJustFinish) {
            set({ isPlaying: false });
            audioSound.setPositionAsync(0);
          }
        }
      });
    } catch (err) {
      console.error("Error loading audio in store", err);
    }
  },

  unloadAudio: async () => {
    const { sound } = get();
    if (sound) {
      await sound.unloadAsync();
      set({ sound: null, isPlaying: false, trackData: null });
    }
  }
}));
