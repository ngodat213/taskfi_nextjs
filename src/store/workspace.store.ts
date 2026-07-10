import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WorkspaceState {
  activeWorkspaceId: string | null;
  setWorkspace: (id: string) => void;
  clearWorkspace: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      activeWorkspaceId: null,
      setWorkspace: (id) => set({ activeWorkspaceId: id }),
      clearWorkspace: () => set({ activeWorkspaceId: null }),
    }),
    {
      name: "workspace-storage",
    },
  ),
);
