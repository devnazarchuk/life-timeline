// life-calendar-app/src/store/userStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserData, UserProfile, LifeBlockData, LifeBlockId } from '@/types/calendar';

// Define the state structure for the store
interface UserState extends UserData {
  setDob: (dob: string) => void;
  updateProfile: (profileData: Partial<UserProfile>) => void;
  getBlock: (id: LifeBlockId) => LifeBlockData | undefined;
  updateBlock: (id: LifeBlockId, data: Partial<LifeBlockData>) => void;
  deleteBlock: (id: LifeBlockId) => void;
  // Ensure all UserData fields are present for the initial state
  // and for the state itself if not spread from a default object.
}

const initialUserData: UserData = {
  dob: '',
  profile: {
    name: '',
    bio: '',
    avatarUrl: '',
    markdownIntro: '',
  },
  blocks: {},
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      ...initialUserData, // Initial state for dob, profile, and blocks

      setDob: (dob) => set({ dob }),

      updateProfile: (profileData) =>
        set((state) => ({
          profile: { ...state.profile, ...profileData },
        })),

      getBlock: (id) => get().blocks[id],

      updateBlock: (id, data) =>
        set((state) => {
          const existingBlock = state.blocks[id] || {
            text: '',
            images: [],
            videos: [],
            spotify: [],
            visibility: 'private', // Default visibility
          };
          return {
            blocks: {
              ...state.blocks,
              [id]: { ...existingBlock, ...data },
            },
          };
        }),

      deleteBlock: (id) =>
        set((state) => {
          const newBlocks = { ...state.blocks };
          delete newBlocks[id];
          return { blocks: newBlocks };
        }),
    }),
    {
      name: 'life_calendar_user', // Key for localStorage
      storage: createJSONStorage(() => localStorage), // Use localStorage
      onRehydrateStorage: (state) => {
        console.log("Hydration finished");
        // Optional: perform actions after hydration, like logging
        return (state, error) => {
          if (error) {
            console.error("An error occurred during hydration:", error);
          }
        }
      }
    }
  )
);

// Optional: Log initial state or when it changes, for debugging
// useUserStore.subscribe(console.log);
