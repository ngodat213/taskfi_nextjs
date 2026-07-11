import { create } from "zustand";

interface WorkspaceState {
  activeWorkspaceId: string | null;
  setWorkspace: (id: string) => void;
  clearWorkspace: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>()((set) => ({
  activeWorkspaceId: null,
  setWorkspace: (id) => set({ activeWorkspaceId: id }),
  clearWorkspace: () => set({ activeWorkspaceId: null }),
}));
