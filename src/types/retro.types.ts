import { IssueAttachment } from "@/types/issue.types";

export type RetroCategory = "went_well" | "to_improve" | "action_item";
export type BackendRetroCategory = "WENT_WELL" | "TO_IMPROVE" | "ACTION_ITEM";
export type RetroSessionStatus = "DRAFT" | "IN_PROGRESS" | "COMPLETED";

export interface RetroComment {
  id: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

export interface RetroItem {
  id: string;
  category: RetroCategory;
  title: string;
  description?: string;
  attachments?: (IssueAttachment | string)[];
  votes: number;
  authorName: string;
  authorAvatar?: string;
  tag?: string;
  tags?: string[];
  assigneeName?: string;
  assigneeAvatar?: string;
  completed?: boolean;
  dueDate?: string;
  comments?: RetroComment[];
  createdAt: string;
}

export interface RetroSprintSession {
  sprintId: string;
  sprintName: string;
  date: string;
  sentimentScore: number;
  totalPointsCompleted: number;
  totalPointsPlanned: number;
  items: RetroItem[];
}

export interface RetroSession {
  id: string;
  projectId: string;
  sprintId: string;
  sprintName: string;
  date: string;
  sentimentScore: number;
  totalPointsCompleted: number;
  totalPointsPlanned: number;
  status: RetroSessionStatus;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRetroSessionRequest {
  sprintId?: string;
  sprintName: string;
  totalPointsPlanned?: number;
  totalPointsCompleted?: number;
  sentimentScore?: number;
}

export interface UpdateRetroSessionRequest {
  sentimentScore?: number;
  status?: RetroSessionStatus;
}

export interface CreateRetroItemRequest {
  category: BackendRetroCategory;
  title: string;
  description?: string;
  tags?: string[];
  assigneeId?: string;
  dueDate?: string;
}

export interface UpdateRetroItemRequest {
  title?: string;
  description?: string;
  tags?: string[];
  completed?: boolean;
  assigneeId?: string;
  dueDate?: string;
}

export interface RetroItemResponseDto {
  id: string;
  sessionId: string;
  category: BackendRetroCategory;
  title: string;
  description?: string;
  tags: string[];
  votesCount: number;
  completed?: boolean;
  assigneeId?: string;
  dueDate?: string;
  createdById: string;
  userVoted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RetroSessionDetailResponse {
  session: RetroSession;
  items: {
    wentWell: RetroItemResponseDto[];
    toImprove: RetroItemResponseDto[];
    actionItem: RetroItemResponseDto[];
  };
}

export function getRetroTags(item: {
  tags?: string[];
  tag?: string;
}): string[] {
  if (item.tags && item.tags.length > 0) return item.tags;
  if (item.tag) return [item.tag];
  return ["General"];
}

export function mapBackendCategoryToFrontend(cat: string): RetroCategory {
  const c = (cat || "").toLowerCase();
  if (c.includes("well")) return "went_well";
  if (c.includes("improve")) return "to_improve";
  return "action_item";
}

export function mapFrontendCategoryToBackend(
  cat: RetroCategory,
): BackendRetroCategory {
  if (cat === "went_well") return "WENT_WELL";
  if (cat === "to_improve") return "TO_IMPROVE";
  return "ACTION_ITEM";
}
