import { apiFetch } from "@/lib/api-fetch";
import { API_ENDPOINTS } from "@/config/api-endpoints";
import {
  BaseResponse,
  PaginatedResponse,
  PaginationParams,
} from "@/types/api.types";
import {
  Group,
  CreateGroupRequest,
  UpdateGroupRequest,
} from "@/types/group.types";

export const groupService = {
  getGroups: async (workspaceId: string, params?: PaginationParams) => {
    return apiFetch<PaginatedResponse<Group>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${workspaceId}/groups`,
      { params },
    );
  },

  getGroup: async (workspaceId: string, groupId: string) => {
    return apiFetch<BaseResponse<Group>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${workspaceId}/groups/${groupId}`,
    );
  },

  createGroup: async (workspaceId: string, data: CreateGroupRequest) => {
    return apiFetch<BaseResponse<Group>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${workspaceId}/groups`,
      { method: "POST", body: data },
    );
  },

  updateGroup: async (
    workspaceId: string,
    groupId: string,
    data: UpdateGroupRequest,
  ) => {
    return apiFetch<BaseResponse<Group>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${workspaceId}/groups/${groupId}`,
      { method: "PUT", body: data },
    );
  },

  deleteGroup: async (workspaceId: string, groupId: string) => {
    return apiFetch<BaseResponse<string>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${workspaceId}/groups/${groupId}`,
      { method: "DELETE" },
    );
  },
};
