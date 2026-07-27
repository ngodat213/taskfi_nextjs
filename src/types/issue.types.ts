import { UserResponseDto } from "@/features/auth/types/auth.types";
import { PaginationParams } from "@/types/api.types";

export type IssueType = string;
export const IssueType = {
  EPIC: "epic",
  STORY: "story",
  TASK: "task",
  BUG: "bug",
  SUBTASK: "subtask",
} as const;

export type IssueStatus = string;
export const IssueStatus = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  DONE: "Done",
} as const;

export type IssuePriority = string;
export const IssuePriority = {
  CRITICAL: "Critical",
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
} as const;

export enum IssueLinkType {
  BLOCKS = "blocks",
  IS_BLOCKED_BY = "is_blocked_by",
  RELATES_TO = "relates_to",
  DUPLICATES = "duplicates",
  IS_DUPLICATED_BY = "is_duplicated_by",
  CLONES = "clones",
  IS_CLONED_BY = "is_cloned_by",
  CAUSES = "causes",
  IS_CAUSED_BY = "is_caused_by",
}

export const ISSUE_LINK_TYPE_LABELS: Record<IssueLinkType | string, string> = {
  [IssueLinkType.BLOCKS]: "blocks",
  [IssueLinkType.IS_BLOCKED_BY]: "is blocked by",
  [IssueLinkType.RELATES_TO]: "relates to",
  [IssueLinkType.DUPLICATES]: "duplicates",
  [IssueLinkType.IS_DUPLICATED_BY]: "is duplicated by",
  [IssueLinkType.CLONES]: "clones",
  [IssueLinkType.IS_CLONED_BY]: "is cloned by",
  [IssueLinkType.CAUSES]: "causes",
  [IssueLinkType.IS_CAUSED_BY]: "is caused by",
};

export interface IssueAttachment {
  uploaderId?: string;
  fileUrl: string;
  fileSize?: number;
  publicId?: string;
  public_id?: string;
  originalName?: string;
  original_name?: string;
  name?: string;
}

export type IssueCommentUser = UserResponseDto;

export interface IssueComment {
  id: string;
  issueId: string;
  userId: string;
  user?: IssueCommentUser;
  body: string;
  createdAt: string;
  updatedAt?: string;
}

export interface IssueLink {
  targetIssueId: string;
  type?: IssueLinkType | string;
}

export interface Issue {
  id: string;
  projectId: string;
  issueKey: string;
  type: IssueType | string;
  status: IssueStatus | string;
  summary: string;
  description: string;
  reporterId: string;
  assigneeId: string;
  priority: IssuePriority | string;
  parentId?: string | null;
  sprintId?: string;
  storyPoints: number;
  originalEstimateSeconds: number;
  remainingEstimateSeconds: number;
  timeSpentSeconds: number;
  dueDate: string;
  links?: (IssueLink | string)[];
  attachments?: (IssueAttachment | string)[];
  createdAt?: string;
  updatedAt?: string;
  children?: Issue[];
}

export interface CreateIssueRequest {
  summary: string;
  type: IssueType | string;
  status: IssueStatus | string;
  description?: string;
  assigneeId?: string;
  priority: IssuePriority | string;
  parentId?: string | null;
  sprintId?: string;
  storyPoints?: number;
  originalEstimateSeconds?: number;
  remainingEstimateSeconds?: number;
  dueDate?: string | null;
  links?: (IssueLink | string)[];
  attachments?: (IssueAttachment | string)[];
}

export type UpdateIssueRequest = Partial<CreateIssueRequest>;

export interface GetIssuesParams extends PaginationParams {
  search?: string;
  teamId?: string;
  assigneeId?: string;
  reporterId?: string;
  type?: string;
  status?: string;
  priority?: string;
  hasParent?: boolean;
  childType?: string;
}
