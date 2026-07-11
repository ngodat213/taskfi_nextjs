import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceService } from "@/services/workspace.service";
import { useAuthStore } from "@/store/auth.store";
import { useWorkspaceStore } from "@/store/workspace.store";
import { PaginationParams } from "@/types/api.types";

export function useEmploymentTypes(params?: PaginationParams) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId,
  );

  return useQuery({
    queryKey: ["employment-types", activeWorkspaceId, params],
    queryFn: () => {
      if (!activeWorkspaceId) throw new Error("No active workspace");
      return workspaceService.getEmploymentTypes(activeWorkspaceId, params);
    },
    enabled: !!accessToken && !!activeWorkspaceId,
  });
}

export function useCreateEmploymentType() {
  const queryClient = useQueryClient();
  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId,
  );

  return useMutation({
    mutationFn: (
      data: Parameters<typeof workspaceService.createEmploymentType>[1],
    ) => {
      if (!activeWorkspaceId) throw new Error("No active workspace");
      return workspaceService.createEmploymentType(activeWorkspaceId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employment-types", activeWorkspaceId],
      });
    },
  });
}

export function useUpdateEmploymentType() {
  const queryClient = useQueryClient();
  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId,
  );

  return useMutation({
    mutationFn: ({
      employmentTypeId,
      data,
    }: {
      employmentTypeId: string;
      data: Parameters<typeof workspaceService.updateEmploymentType>[2];
    }) => {
      if (!activeWorkspaceId) throw new Error("No active workspace");
      return workspaceService.updateEmploymentType(
        activeWorkspaceId,
        employmentTypeId,
        data,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employment-types", activeWorkspaceId],
      });
    },
  });
}

export function useDeleteEmploymentType() {
  const queryClient = useQueryClient();
  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId,
  );

  return useMutation({
    mutationFn: (employmentTypeId: string) => {
      if (!activeWorkspaceId) throw new Error("No active workspace");
      return workspaceService.deleteEmploymentType(
        activeWorkspaceId,
        employmentTypeId,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employment-types", activeWorkspaceId],
      });
    },
  });
}
