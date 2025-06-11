import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { produce } from 'immer';

// --- Types ---

// Unique block ID types for week, month, year
export type LifeBlockId =
  | `week_${number}_${number}`
  | `month_${number}_${number}`
  | `year_${number}`;

// Data for each block (week/month/year)
export interface LifeBlockData {
  text: string;
  images: string[];
  videos: string[];
  spotify: string[];
  visibility: 'public' | 'private' | 'friends';
  tags: string[];
}

// User profile info
export interface UserProfile {
  name: string;
  bio: string;
  avatarUrl: string;
  markdownIntro?: string;
}

// All user data stored in localStorage
export interface UserData {
  dob: string; // YYYY-MM-DD
  profile: UserProfile;
  blocks: Record<LifeBlockId, LifeBlockData>;
}

// --- Zustand Store ---

interface LifeStore {
  userData: UserData | null;
  setUserData: (data: UserData) => void;
  updateBlock: (id: LifeBlockId, data: Partial<LifeBlockData>) => void;
  setProfile: (profile: Partial<UserProfile>) => void;
  clearAll: () => void;
}

// Key for localStorage
const STORAGE_KEY = 'life_calendar_user';

export const useLifeStore = create<LifeStore>()(
  persist(
    (set) => ({
      userData: null,

      // Set all user data (e.g. on DOB entry or import)
      setUserData: (data) => set({ userData: data }),

      // Update a single block (week/month/year)
      updateBlock: (id, data) =>
        set(
          produce((state: LifeStore) => {
            if (!state.userData) return;
            if (!state.userData.blocks[id]) {
              // If block doesn't exist, create it
              state.userData.blocks[id] = {
                text: '',
                images: [],
                videos: [],
                spotify: [],
                visibility: 'private',
                tags: [],
                ...data,
              };
            } else {
              // Update existing block
              Object.assign(state.userData.blocks[id], data);
              // Ensure tags field exists
              const block = state.userData.blocks[id];
              if (block && typeof block === 'object' && !Array.isArray(block) && !('tags' in block)) {
                (block as LifeBlockData).tags = [];
              }
            }
          })
        ),

      // Update user profile fields
      setProfile: (profile) =>
        set(
          produce((state: LifeStore) => {
            if (!state.userData) return;
            Object.assign(state.userData.profile, profile);
          })
        ),

      // Clear all user data (e.g. for reset)
      clearAll: () => set({ userData: null }),
    }),
    {
      name: STORAGE_KEY,
      // Only persist userData
      partialize: (state) => ({ userData: state.userData }),
    }
  )
);

// Usage: const { userData, setUserData, updateBlock, setProfile, clearAll } = useLifeStore(); 