// life-calendar-app/src/store/userStore.test.ts
import { useUserStore } from './userStore';
import type { UserProfile, LifeBlockData, LifeBlockId } from '@/types/calendar';
import { act } from '@testing-library/react'; // if needed for store updates that trigger React updates

const initialStoreState = useUserStore.getState();

describe('useUserStore', () => {
  beforeEach(() => {
    // Reset store to initial state and clear localStorage mock before each test
    localStorage.clear();
    useUserStore.setState(initialStoreState, true); // Replace state
     act(() => {
      useUserStore.persist.rehydrate(); // Ensure rehydration from (mocked) localStorage
    });
  });

  it('should set date of birth', () => {
    const newDob = '1990-01-01';
    act(() => {
      useUserStore.getState().setDob(newDob);
    });
    expect(useUserStore.getState().dob).toBe(newDob);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'life_calendar_user',
      expect.stringContaining('"dob":"1990-01-01"')
    );
  });

  it('should update profile', () => {
    const profileUpdate: Partial<UserProfile> = { name: 'John Doe', bio: 'Test bio' };
    act(() => {
      useUserStore.getState().updateProfile(profileUpdate);
    });
    const state = useUserStore.getState();
    expect(state.profile.name).toBe('John Doe');
    expect(state.profile.bio).toBe('Test bio');
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'life_calendar_user',
      expect.stringContaining('"name":"John Doe"')
    );
  });

  it('should update and get a life block', () => {
    const blockId: LifeBlockId = 'week_2023_10';
    const blockData: Partial<LifeBlockData> = { text: 'Test week', visibility: 'public' };

    act(() => {
      useUserStore.getState().updateBlock(blockId, blockData);
    });

    const fetchedBlock = useUserStore.getState().getBlock(blockId);
    expect(fetchedBlock).toBeDefined();
    expect(fetchedBlock?.text).toBe('Test week');
    expect(fetchedBlock?.visibility).toBe('public');
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'life_calendar_user',
      expect.stringContaining('"text":"Test week"')
    );

    // Update existing block
    const updatedBlockData: Partial<LifeBlockData> = { text: 'Updated week text' };
    act(() => {
      useUserStore.getState().updateBlock(blockId, updatedBlockData);
    });
    const updatedBlock = useUserStore.getState().getBlock(blockId);
    expect(updatedBlock?.text).toBe('Updated week text');
    expect(updatedBlock?.visibility).toBe('public'); // Should retain other fields
  });

  it('should use default visibility for new blocks if not specified', () => {
    const blockId: LifeBlockId = 'week_2023_11';
    const blockData: Partial<LifeBlockData> = { text: 'Another test week' };
     act(() => {
      useUserStore.getState().updateBlock(blockId, blockData);
    });
    const fetchedBlock = useUserStore.getState().getBlock(blockId);
    expect(fetchedBlock?.visibility).toBe('private'); // Default visibility
  });

  it('should delete a life block', () => {
    const blockId: LifeBlockId = 'week_2023_12';
    const blockData: Partial<LifeBlockData> = { text: 'To be deleted' };
    act(() => {
      useUserStore.getState().updateBlock(blockId, blockData);
    });

    let fetchedBlock = useUserStore.getState().getBlock(blockId);
    expect(fetchedBlock).toBeDefined();

    act(() => {
      useUserStore.getState().deleteBlock(blockId);
    });
    fetchedBlock = useUserStore.getState().getBlock(blockId);
    expect(fetchedBlock).toBeUndefined();
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'life_calendar_user',
      expect.not.stringContaining('"To be deleted"')
    );
  });

  it('should load data from localStorage on initialization', () => {
    const persistedState = {
      dob: '1985-05-15',
      profile: { name: 'Jane Doe', bio: 'Loaded from LS', avatarUrl: '', markdownIntro: '' },
      blocks: { 'year_1985_1985': { text: 'Born', images: [], videos: [], spotify: [], visibility: 'private' } },
    };
    localStorage.setItem('life_calendar_user', JSON.stringify({ version: 0, state: persistedState })); // Zustand persist format

    // Re-initialize store or trigger rehydration
    // For testing, we can directly call rehydrate if store is configured for it
    // or reset and let it auto-rehydrate if persist middleware is set up for that.
    // The beforeEach already calls rehydrate.
    act(() => {
      useUserStore.persist.rehydrate();
    });

    const state = useUserStore.getState();
    expect(state.dob).toBe('1985-05-15');
    expect(state.profile.name).toBe('Jane Doe');
    expect(state.blocks['year_1985_1985']?.text).toBe('Born');
  });
});
