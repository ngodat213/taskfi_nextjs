export type AiIntent =
  | "CHAT"
  | "CREATE_ISSUE"
  | "UPDATE_ISSUE"
  | "CREATE_SUBTASKS"
  | "SUGGEST_SPRINT";

export type AiActionType =
  "ISSUE_DRAFT" | "ISSUE_UPDATE" | "SUBTASK_LIST" | "SPRINT_RECOMMENDATION";

export interface AiStep {
  id: string;
  title: string;
  status: "running" | "completed" | "failed";
  message?: string;
}

export interface IssueDraftPayload {
  summary: string;
  type: string;
  status: string;
  priority: string;
  description: string;
  storyPoints?: number;
  originalEstimateSeconds?: number;
}

export interface AiAction {
  type: AiActionType;
  payload: IssueDraftPayload | Record<string, unknown>;
}

export interface AiGenerateIssueResponse {
  intent: AiIntent;
  replyMessage: string;
  steps?: AiStep[];
  action?: AiAction;

  /** Backward compatibility fallback fields */
  isIssueRequest?: boolean;
  summary?: string;
  type?: string;
  status?: string;
  priority?: string;
  description?: string;
  storyPoints?: number;
  originalEstimateSeconds?: number;
}
