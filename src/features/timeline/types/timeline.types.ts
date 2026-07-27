export type TimelineViewMode = "gantt" | "milestones" | "sprints";
export type TimelineZoom = "week" | "month" | "quarter";

export interface TimelineAssignee {
  id: string;
  name: string;
  avatar?: string;
  avatarBg?: string;
}

export interface TimelineItem {
  id: string;
  title: string;
  code: string;
  category: "epic" | "feature" | "milestone" | "sprint";
  groupId: string;
  projectId: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: "in_progress" | "completed" | "planned" | "delayed";
  priority: "low" | "medium" | "high" | "urgent";
  assignees: TimelineAssignee[];
  dependencies?: string[];
  color?: string;
  subItemsCount?: number;
  tags?: string[];
}

export interface MilestoneItem {
  id: string;
  title: string;
  groupId: string;
  projectId: string;
  dueDate: string;
  status: "on_track" | "at_risk" | "completed" | "upcoming";
  owner: TimelineAssignee;
  completedTasks: number;
  totalTasks: number;
  keyDeliverable: string;
}

export interface TimelineSummary {
  activeEpics: number;
  totalMilestones: number;
  onTrackPercentage: number;
  daysToNextRelease: number;
}
