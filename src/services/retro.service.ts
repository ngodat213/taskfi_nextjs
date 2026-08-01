import { API_ENDPOINTS } from "@/config/api-endpoints";
import { apiFetch } from "@/lib/api-fetch";
import { BaseResponse } from "@/types/api.types";
import {
  CreateRetroItemRequest,
  CreateRetroSessionRequest,
  RetroComment,
  RetroItem,
  RetroSession,
  RetroSessionDetailResponse,
  UpdateRetroItemRequest,
  UpdateRetroSessionRequest,
} from "@/types/retro.types";

export const retroService = {
  // Get all retro sessions for a project
  getRetroSessions: async (projectId: string, sprintId?: string) => {
    return apiFetch<BaseResponse<RetroSession[]>>(
      `${API_ENDPOINTS.PROJECTS.BASE}/${projectId}/retros`,
      { params: sprintId ? { sprintId } : undefined },
    );
  },

  // Create a new retro session
  createRetroSession: async (
    projectId: string,
    data: CreateRetroSessionRequest,
  ) => {
    return apiFetch<BaseResponse<RetroSession>>(
      `${API_ENDPOINTS.PROJECTS.BASE}/${projectId}/retros`,
      { method: "POST", body: data },
    );
  },

  // Get session details with 3-column items
  getRetroSessionDetail: async (sessionId: string) => {
    return apiFetch<BaseResponse<RetroSessionDetailResponse>>(
      `${API_ENDPOINTS.RETROS.BASE}/${sessionId}`,
    );
  },

  // Update session status/sentiment
  updateRetroSession: async (
    sessionId: string,
    data: UpdateRetroSessionRequest,
  ) => {
    return apiFetch<BaseResponse<RetroSession>>(
      `${API_ENDPOINTS.RETROS.BASE}/${sessionId}`,
      { method: "PATCH", body: data },
    );
  },

  // Create a new retro item
  createRetroItem: async (sessionId: string, data: CreateRetroItemRequest) => {
    return apiFetch<BaseResponse<RetroItem>>(
      `${API_ENDPOINTS.RETROS.BASE}/${sessionId}/items`,
      { method: "POST", body: data },
    );
  },

  // Update retro item
  updateRetroItem: async (itemId: string, data: UpdateRetroItemRequest) => {
    return apiFetch<BaseResponse<RetroItem>>(
      `${API_ENDPOINTS.RETROS.BASE}/items/${itemId}`,
      { method: "PATCH", body: data },
    );
  },

  // Delete retro item
  deleteRetroItem: async (itemId: string) => {
    return apiFetch<BaseResponse<void>>(
      `${API_ENDPOINTS.RETROS.BASE}/items/${itemId}`,
      { method: "DELETE" },
    );
  },

  // Toggle upvote
  toggleVote: async (itemId: string) => {
    return apiFetch<BaseResponse<{ votesCount: number; userVoted: boolean }>>(
      `${API_ENDPOINTS.RETROS.BASE}/items/${itemId}/vote`,
      { method: "POST" },
    );
  },

  // Get item comments
  getRetroComments: async (itemId: string) => {
    return apiFetch<BaseResponse<RetroComment[]>>(
      `${API_ENDPOINTS.RETROS.BASE}/items/${itemId}/comments`,
    );
  },

  // Add comment
  addRetroComment: async (itemId: string, content: string) => {
    return apiFetch<BaseResponse<RetroComment>>(
      `${API_ENDPOINTS.RETROS.BASE}/items/${itemId}/comments`,
      { method: "POST", body: { content } },
    );
  },
};
