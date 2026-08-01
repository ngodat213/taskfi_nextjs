import { API_ENDPOINTS } from "@/config/api-endpoints";
import { apiFetch } from "@/lib/api-fetch";
import { AiGenerateIssueResponse } from "@/types/ai.types";
import { BaseResponse, PaginatedResponse } from "@/types/api.types";
import {
  CreateIssueRequest,
  GetIssuesParams,
  GetMyTasksParams,
  Issue,
  IssueActivity,
  IssueComment,
  UpdateIssueRequest,
} from "@/types/issue.types";

export type { GetIssuesParams, GetMyTasksParams };

export const issueService = {
  aiGenerateIssue: async (
    workspaceId: string,
    prompt: string,
    contextIssue?: {
      id?: string;
      summary?: string;
      description?: string;
      type?: string;
      status?: string;
      priority?: string;
      storyPoints?: number;
    },
  ): Promise<AiGenerateIssueResponse> => {
    const res = await apiFetch<
      BaseResponse<AiGenerateIssueResponse> | AiGenerateIssueResponse
    >(API_ENDPOINTS.WORKSPACES.AI_GENERATE(workspaceId), {
      method: "POST",
      body: { prompt, contextIssue },
    });

    if ("data" in res && res.data) {
      return res.data;
    }
    return res as AiGenerateIssueResponse;
  },
  getMyTasks: async (workspaceId: string, params?: GetMyTasksParams) => {
    return apiFetch<PaginatedResponse<Issue>>(
      `${API_ENDPOINTS.WORKSPACES.LIST}/${workspaceId}/my-tasks`,
      { params },
    );
  },

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

  getParentOptions: async (
    projectId: string,
    params: { type: string; search?: string },
  ) => {
    return apiFetch<BaseResponse<Issue[]>>(
      `${API_ENDPOINTS.PROJECTS.BASE}/${projectId}/issues/parent-options`,
      { params },
    );
  },

  getChildOptions: async (
    projectId: string,
    params?: { parentType?: string; search?: string },
  ) => {
    return apiFetch<BaseResponse<Issue[]>>(
      `${API_ENDPOINTS.PROJECTS.BASE}/${projectId}/issues/child-options`,
      { params },
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

  getIssueActivities: async (issueId: string) => {
    return apiFetch<BaseResponse<IssueActivity[]>>(
      API_ENDPOINTS.ISSUES.ACTIVITIES(issueId),
    );
  },
};
