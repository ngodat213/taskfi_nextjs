import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api-endpoints";
import { BaseResponse, PaginationParams } from "@/types/api.types";
import {
  Group,
  CreateGroupRequest,
  UpdateGroupRequest,
} from "@/types/group.types";

export const groupService = {
  getGroups: async (workspaceId: string, params?: PaginationParams) => {
    const response = await apiClient.get<BaseResponse<Group[]>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${workspaceId}/groups`,
      { params },
    );
    return response.data;
  },

  getGroup: async (workspaceId: string, groupId: string) => {
    const response = await apiClient.get<BaseResponse<Group>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${workspaceId}/groups/${groupId}`,
    );
    return response.data;
  },

  createGroup: async (workspaceId: string, data: CreateGroupRequest) => {
    const response = await apiClient.post<BaseResponse<Group>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${workspaceId}/groups`,
      data,
    );
    return response.data;
  },

  updateGroup: async (
    workspaceId: string,
    groupId: string,
    data: UpdateGroupRequest,
  ) => {
    const response = await apiClient.put<BaseResponse<Group>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${workspaceId}/groups/${groupId}`,
      data,
    );
    return response.data;
  },

  deleteGroup: async (workspaceId: string, groupId: string) => {
    const response = await apiClient.delete<BaseResponse<string>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${workspaceId}/groups/${groupId}`,
    );
    return response.data;
  },
};
