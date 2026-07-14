import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api-endpoints";
import {
  BaseResponse,
  PaginatedResponse,
  PaginationParams,
} from "@/types/api.types";
import { Project, CreateProjectRequest } from "@/types/project.types";

export const projectService = {
  getProjects: async (groupId: string, params?: PaginationParams) => {
    const response = await apiClient.get<PaginatedResponse<Project>>(
      `${API_ENDPOINTS.GROUPS.BASE}/${groupId}/projects`,
      { params },
    );
    return response.data;
  },
  createProject: async (groupId: string, data: CreateProjectRequest) => {
    const response = await apiClient.post<BaseResponse<Project>>(
      `${API_ENDPOINTS.GROUPS.BASE}/${groupId}/projects`,
      data,
    );
    return response.data;
  },
};
