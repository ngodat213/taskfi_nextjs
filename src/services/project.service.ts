import { apiFetch } from "@/lib/api-fetch";
import { API_ENDPOINTS } from "@/config/api-endpoints";
import {
  BaseResponse,
  PaginatedResponse,
  PaginationParams,
} from "@/types/api.types";
import { Project, CreateProjectRequest } from "@/types/project.types";

export const projectService = {
  getProjects: async (groupId: string, params?: PaginationParams) => {
    return apiFetch<PaginatedResponse<Project>>(
      `${API_ENDPOINTS.GROUPS.BASE}/${groupId}/projects`,
      { params },
    );
  },
  getProject: async (projectId: string) => {
    return apiFetch<BaseResponse<Project>>(
      `${API_ENDPOINTS.PROJECTS.BASE}/${projectId}`,
    );
  },
  createProject: async (groupId: string, data: CreateProjectRequest) => {
    return apiFetch<BaseResponse<Project>>(
      `${API_ENDPOINTS.GROUPS.BASE}/${groupId}/projects`,
      { method: "POST", body: data },
    );
  },
  updateProject: async (
    projectId: string,
    data: Partial<CreateProjectRequest>,
  ) => {
    return apiFetch<BaseResponse<Project>>(
      `${API_ENDPOINTS.PROJECTS.BASE}/${projectId}`,
      { method: "PATCH", body: data },
    );
  },
};
