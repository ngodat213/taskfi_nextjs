import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Workspace } from "@/types/workspace.types";

interface WorkspaceState {
  activeWorkspaceId: string | null;
  activeWorkspace: Workspace | null;
  setWorkspace: (id: string, workspace?: Workspace) => void;
  clearWorkspace: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      activeWorkspaceId: null,
      activeWorkspace: null,
      setWorkspace: (id, workspace) =>
        set({ activeWorkspaceId: id, activeWorkspace: workspace || null }),
      clearWorkspace: () =>
        set({ activeWorkspaceId: null, activeWorkspace: null }),
    }),
    {
      name: "workspace-storage",
    },
  ),
);
