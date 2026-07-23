import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  role?: string;
  bio?: string;
  jobTitle?: string;
  department?: string;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  language: "en" | "vi";
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  documentsViewMode: "grid" | "list";
  documentsStarredOnly: boolean;
}

interface UserState {
  user: UserProfile | null;
  preferences: UserPreferences;
  setUser: (user: UserProfile | null) => void;
  updateUser: (partialUser: Partial<UserProfile>) => void;
  setPreferences: (preferences: Partial<UserPreferences>) => void;
  setDocumentsViewMode: (mode: "grid" | "list") => void;
  setDocumentsStarredOnly: (onlyStarred: boolean) => void;
  clearUser: () => void;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: "system",
  language: "vi",
  timezone: "Asia/Ho_Chi_Minh",
  emailNotifications: true,
  pushNotifications: true,
  documentsViewMode: "grid",
  documentsStarredOnly: false,
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      preferences: DEFAULT_PREFERENCES,
      setUser: (user) => set({ user }),
      updateUser: (partialUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partialUser } : null,
        })),
      setPreferences: (newPreferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        })),
      setDocumentsViewMode: (documentsViewMode) =>
        set((state) => ({
          preferences: { ...state.preferences, documentsViewMode },
        })),
      setDocumentsStarredOnly: (documentsStarredOnly) =>
        set((state) => ({
          preferences: { ...state.preferences, documentsStarredOnly },
        })),
      clearUser: () =>
        set({
          user: null,
          preferences: DEFAULT_PREFERENCES,
        }),
    }),
    {
      name: "user-storage",
    },
  ),
);
