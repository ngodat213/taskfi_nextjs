import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { groupService } from "@/services/group.service";
import { useAuthStore } from "@/store/auth.store";
import { useWorkspaceStore } from "@/store/workspace.store";
import { PaginationParams } from "@/types/api.types";

export function useGroups(params?: PaginationParams) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId,
  );

  return useQuery({
    queryKey: ["groups", activeWorkspaceId, params],
    queryFn: () => {
      if (!activeWorkspaceId) throw new Error("No active workspace");
      return groupService.getGroups(activeWorkspaceId, params);
    },
    enabled: !!accessToken && !!activeWorkspaceId,
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();
  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId,
  );

  return useMutation({
    mutationFn: (data: Parameters<typeof groupService.createGroup>[1]) => {
      if (!activeWorkspaceId) throw new Error("No active workspace");
      return groupService.createGroup(activeWorkspaceId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["groups", activeWorkspaceId],
      });
    },
  });
}

export function useUpdateGroup() {
  const queryClient = useQueryClient();
  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId,
  );

  return useMutation({
    mutationFn: ({
      groupId,
      data,
    }: {
      groupId: string;
      data: Parameters<typeof groupService.updateGroup>[2];
    }) => {
      if (!activeWorkspaceId) throw new Error("No active workspace");
      return groupService.updateGroup(activeWorkspaceId, groupId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["groups", activeWorkspaceId],
      });
    },
  });
}
