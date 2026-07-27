import { apiFetch } from "@/lib/api-fetch";
import { API_ENDPOINTS } from "@/config/api-endpoints";
import { PaginatedResponse, BaseResponse } from "@/types/api.types";
import {
  Issue,
  IssueComment,
  CreateIssueRequest,
  UpdateIssueRequest,
  GetIssuesParams,
} from "@/types/issue.types";

export type { GetIssuesParams };

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

  createLink: async (issueId: string, targetIssueId: string, type: string) => {
    return apiFetch<BaseResponse<unknown>>(
      `${API_ENDPOINTS.ISSUES.BASE}/${issueId}/links`,
      {
        method: "POST",
        body: { targetIssueId, type },
      },
    );
  },

  removeLink: async (issueId: string, targetIssueId: string) => {
    return apiFetch<BaseResponse<unknown>>(
      `${API_ENDPOINTS.ISSUES.BASE}/${issueId}/links/${targetIssueId}`,
      {
        method: "DELETE",
      },
    );
  },

  getIssueComments: async (issueId: string) => {
    return apiFetch<BaseResponse<IssueComment[]>>(
      API_ENDPOINTS.ISSUES.COMMENTS(issueId),
    );
  },

  addComment: async (issueId: string, body: string) => {
    return apiFetch<BaseResponse<IssueComment>>(
      API_ENDPOINTS.ISSUES.COMMENTS(issueId),
      {
        method: "POST",
        body: { body },
      },
    );
  },
};
