export enum IssueType {
  EPIC = "epic",
  STORY = "story",
  TASK = "task",
  BUG = "bug",
  SUBTASK = "subtask",
}

export enum IssueStatus {
  TODO = "To Do",
  IN_PROGRESS = "In Progress",
  IN_REVIEW = "In Review",
  DONE = "Done",
}

export enum IssuePriority {
  CRITICAL = "Critical",
  HIGH = "High",
  MEDIUM = "Medium",
  LOW = "Low",
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
  parentId?: string;
  sprintId?: string;
  storyPoints: number;
  originalEstimateSeconds: number;
  remainingEstimateSeconds: number;
  timeSpentSeconds: number;
  dueDate: string;
  links: string[];
  attachments: string[];
  createdAt: string;
  updatedAt: string;
  children?: Issue[];
}

export interface CreateIssueRequest {
  summary: string;
  type: IssueType | string;
  status: IssueStatus | string;
  description?: string;
  assigneeId?: string;
  priority: IssuePriority | string;
  parentId?: string;
  sprintId?: string;
  storyPoints?: number;
  originalEstimateSeconds?: number;
  remainingEstimateSeconds?: number;
  dueDate?: string | null;
  links?: string[];
  attachments?: string[];
}

export type UpdateIssueRequest = Partial<CreateIssueRequest>;
