// life-calendar-app/src/types/calendar.ts

// Type for the unique identifier of each life block.
// The template literal types will ensure the format is correct.
// Example: 'week_2023_52', 'month_2024_01', 'year_1990'
export type ViewMode = 'weeks' | 'months' | 'years';

export type LifeBlockId = `week_${number}_${number}` | `month_${number}_${number}` | `year_${number}`;

// Interface for the data stored within each life block.
export interface LifeBlockData {
  text: string;
  images: string[]; // Array of image URLs or identifiers
  videos: string[]; // Array of video URLs or identifiers (e.g., YouTube IDs)
  spotify: string[]; // Array of Spotify track IDs or URLs
  visibility: "public" | "private" | "friends"; // "friends" for future use
}

// Interface for the user's profile information.
export interface UserProfile {
  name: string;
  bio: string;
  avatarUrl: string; // URL to the avatar image
  markdownIntro?: string; // Optional Markdown string for GitHub-style profile
}

// Interface for the overall user data structure.
// This will be the structure stored in localStorage.
export interface UserData {
  dob: string; // Date of birth in 'YYYY-MM-DD' format
  profile: UserProfile;
  blocks: Record<LifeBlockId, LifeBlockData>;
}
