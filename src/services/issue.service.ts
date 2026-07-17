import { apiFetch } from "@/lib/api-fetch";
import { API_ENDPOINTS } from "@/config/api-endpoints";
import {
  PaginatedResponse,
  PaginationParams,
  BaseResponse,
} from "@/types/api.types";
import {
  Issue,
  CreateIssueRequest,
  UpdateIssueRequest,
} from "@/types/issue.types";

export interface GetIssuesParams extends PaginationParams {
  search?: string;
  teamId?: string;
  assigneeId?: string;
  reporterId?: string;
  type?: string;
  status?: string;
  priority?: string;
}

export const issueService = {
  getIssuesByProject: async (projectId: string, params?: GetIssuesParams) => {
    return apiFetch<PaginatedResponse<Issue>>(
      `${API_ENDPOINTS.PROJECTS.BASE}/${projectId}/issues`,
      { params },
    );
  },

  getIssueById: async (projectId: string, issueId: string) => {
    return apiFetch<BaseResponse<Issue>>(
      `${API_ENDPOINTS.PROJECTS.BASE}/${projectId}/issues/${issueId}`,
    );
  },

  getIssueChildren: async (projectId: string, issueId: string) => {
    return apiFetch<BaseResponse<Issue[]>>(
      `${API_ENDPOINTS.PROJECTS.BASE}/${projectId}/issues/${issueId}/children`,
    );
  },

  createIssue: async (projectId: string, data: CreateIssueRequest) => {
    return apiFetch<BaseResponse<Issue>>(
      `${API_ENDPOINTS.PROJECTS.BASE}/${projectId}/issues`,
      { method: "POST", body: data },
    );
  },

  updateIssue: async (
    projectId: string,
    issueId: string,
    data: UpdateIssueRequest,
  ) => {
    return apiFetch<BaseResponse<Issue>>(
      `${API_ENDPOINTS.PROJECTS.BASE}/${projectId}/issues/${issueId}`,
      { method: "PUT", body: data },
    );
  },
};
