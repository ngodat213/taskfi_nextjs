import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceService } from "@/services/workspace.service";
import { useAuthStore } from "@/store/auth.store";
import { useWorkspaceStore } from "@/store/workspace.store";
import { PaginationParams } from "@/types/api.types";

export function useDepartments(params?: PaginationParams) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId,
  );

  return useQuery({
    queryKey: ["departments", activeWorkspaceId, params],
    queryFn: () => {
      if (!activeWorkspaceId) throw new Error("No active workspace");
      return workspaceService.getDepartments(activeWorkspaceId, params);
    },
    enabled: !!accessToken && !!activeWorkspaceId,
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId,
  );

  return useMutation({
    mutationFn: (
      data: Parameters<typeof workspaceService.createDepartment>[1],
    ) => {
      if (!activeWorkspaceId) throw new Error("No active workspace");
      return workspaceService.createDepartment(activeWorkspaceId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["departments", activeWorkspaceId],
      });
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();
  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId,
  );

  return useMutation({
    mutationFn: ({
      departmentId,
      data,
    }: {
      departmentId: string;
      data: Parameters<typeof workspaceService.updateDepartment>[2];
    }) => {
      if (!activeWorkspaceId) throw new Error("No active workspace");
      return workspaceService.updateDepartment(
        activeWorkspaceId,
        departmentId,
        data,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["departments", activeWorkspaceId],
      });
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId,
  );

  return useMutation({
    mutationFn: (departmentId: string) => {
      if (!activeWorkspaceId) throw new Error("No active workspace");
      return workspaceService.deleteDepartment(activeWorkspaceId, departmentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["departments", activeWorkspaceId],
      });
    },
  });
}
