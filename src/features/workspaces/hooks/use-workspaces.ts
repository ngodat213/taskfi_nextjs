import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceService } from "@/features/workspaces/api/workspace.service";
import { useAuthStore } from "@/store/auth.store";

export function useWorkspaces(page = 1, limit = 10) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["workspaces", page, limit],
    queryFn: () => workspaceService.getWorkspaces(page, limit),
    enabled: !!accessToken,
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: workspaceService.createWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
}
