import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api-endpoints";
import {
  WorkspaceResponse,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  Workspace,
  WorkspaceMember,
  InviteWorkspaceMemberRequest,
  WorkspaceRole,
  CreateRoleRequest,
  UpdateRoleRequest,
} from "@/features/workspaces/types/workspace.types";
import { BaseResponse, PaginatedResponse } from "@/types/api.types";

export const workspaceService = {
  getWorkspaces: async (page = 1, limit = 10) => {
    const response = await apiClient.get<WorkspaceResponse>(
      `${API_ENDPOINTS.WORKSPACES.LIST}?page=${page}&limit=${limit}`,
    );
    return response.data;
  },

  getWorkspace: async (id: string) => {
    const response = await apiClient.get<BaseResponse<Workspace>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${id}`,
    );
    return response.data;
  },

  createWorkspace: async (data: CreateWorkspaceRequest) => {
    const response = await apiClient.post<BaseResponse<Workspace>>(
      API_ENDPOINTS.WORKSPACES.CREATE,
      data,
    );
    return response.data;
  },

  updateWorkspace: async (id: string, data: UpdateWorkspaceRequest) => {
    const response = await apiClient.put<BaseResponse<Workspace>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${id}`,
      data,
    );
    return response.data;
  },

  deleteWorkspace: async (id: string) => {
    const response = await apiClient.delete<BaseResponse<string>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${id}`,
    );
    return response.data;
  },

  getWorkspaceMembers: async (
    id: string,
    page = 1,
    limit = 10,
    search?: string,
  ) => {
    let url = `${API_ENDPOINTS.WORKSPACES.LIST}/${id}/members?page=${page}&limit=${limit}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    const response =
      await apiClient.get<PaginatedResponse<WorkspaceMember>>(url);
    return response.data;
  },

  inviteMember: async (id: string, data: InviteWorkspaceMemberRequest) => {
    const response = await apiClient.post<BaseResponse<WorkspaceMember>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${id}/members/invite`,
      data,
    );
    return response.data;
  },

  // ROLES
  getWorkspaceRoles: async (id: string) => {
    const response = await apiClient.get<BaseResponse<WorkspaceRole[]>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${id}/roles`,
    );
    return response.data;
  },

  createWorkspaceRole: async (id: string, data: CreateRoleRequest) => {
    const response = await apiClient.post<BaseResponse<WorkspaceRole>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${id}/roles`,
      data,
    );
    return response.data;
  },

  updateWorkspaceRole: async (
    id: string,
    roleId: string,
    data: UpdateRoleRequest,
  ) => {
    const response = await apiClient.put<BaseResponse<WorkspaceRole>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${id}/roles/${roleId}`,
      data,
    );
    return response.data;
  },

  deleteWorkspaceRole: async (id: string, roleId: string) => {
    const response = await apiClient.delete<BaseResponse<string>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${id}/roles/${roleId}`,
    );
    return response.data;
  },
};
