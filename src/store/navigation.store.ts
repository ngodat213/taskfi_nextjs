import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface NavigationItem {
  name: string;
  backLink: string;
  description?: string;
  logoUrl?: string | null;
}

interface NavigationState {
  stack: NavigationItem[];
  push: (item: NavigationItem) => void;
  pop: () => void;
  clear: () => void;
}

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set) => ({
      stack: [],
      push: (item) => set((state) => ({ stack: [...state.stack, item] })),
      pop: () => set((state) => ({ stack: state.stack.slice(0, -1) })),
      clear: () => set({ stack: [] }),
    }),
    {
      name: "navigation-storage",
    }
  )
);
