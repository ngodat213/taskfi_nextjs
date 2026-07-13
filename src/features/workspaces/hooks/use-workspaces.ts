import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceService } from "@/services/workspace.service";
import { useAuthStore } from "@/store/auth.store";
import { PaginationParams } from "@/types/api.types";
import {
  InviteWorkspaceMemberRequest,
  CreateRoleRequest,
  UpdateWorkspaceMemberRequest,
} from "@/types/workspace.types";
import { WorkspaceMemberQueryParams } from "@/types/workspace.types";

export function useWorkspaces(params?: PaginationParams) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["workspaces", params],
    queryFn: () => workspaceService.getWorkspaces(params),
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

export function useWorkspaceMembers(
  workspaceId: string,
  params?: WorkspaceMemberQueryParams,
) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["workspace-members", workspaceId, params],
    queryFn: () => workspaceService.getWorkspaceMembers(workspaceId, params),
    enabled: !!accessToken && !!workspaceId,
  });
}

export function useWorkspaceRoles(workspaceId: string) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["workspace-roles", workspaceId],
    queryFn: () => workspaceService.getWorkspaceRoles(workspaceId),
    enabled: !!accessToken && !!workspaceId,
  });
}

export function useCreateWorkspaceRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      data,
    }: {
      workspaceId: string;
      data: CreateRoleRequest;
    }) => workspaceService.createWorkspaceRole(workspaceId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace-roles", variables.workspaceId],
      });
    },
  });
}

export function useInviteWorkspaceMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      data,
    }: {
      workspaceId: string;
      data: InviteWorkspaceMemberRequest;
    }) => workspaceService.inviteMember(workspaceId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace-members", variables.workspaceId],
      });
    },
  });
}

export function useUpdateWorkspaceMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      memberId,
      data,
    }: {
      workspaceId: string;
      memberId: string;
      data: UpdateWorkspaceMemberRequest;
    }) => workspaceService.updateWorkspaceMember(workspaceId, memberId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace-members", variables.workspaceId],
      });
    },
  });
}

export function useRemoveWorkspaceMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      memberId,
    }: {
      workspaceId: string;
      memberId: string;
    }) => workspaceService.removeWorkspaceMember(workspaceId, memberId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace-members", variables.workspaceId],
      });
    },
  });
}

export function useUpdateWorkspaceRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      roleId,
      data,
    }: {
      workspaceId: string;
      roleId: string;
      data: Parameters<typeof workspaceService.updateWorkspaceRole>[2];
    }) => workspaceService.updateWorkspaceRole(workspaceId, roleId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace-roles", variables.workspaceId],
      });
    },
  });
}
