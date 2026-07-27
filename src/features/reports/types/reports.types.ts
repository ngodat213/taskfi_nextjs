export interface BurndownPoint {
  day: string;
  date: string;
  idealRemaining: number;
  actualRemaining: number;
  completedPoints: number;
  scopeAdded: number;
}

export interface TeamMemberVelocity {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  team: string;
  projectId?: string;
  groupId?: string;
  completedPoints: number;
  assignedPoints: number;
  completionRate: number;
  tasksCompleted: number;
  avgTimePerTask: string;
  status: "overburdened" | "optimal" | "available";
  avatarBg: string;
}

export interface CategoryBreakdown {
  category: string;
  count: number;
  points: number;
  percentage: number;
  color: string;
}

export interface SprintHistoryItem {
  sprintName: string;
  committedPoints: number;
  completedPoints: number;
  completionRate: number;
  velocityTrend: number;
}

export interface SprintMetricsSummary {
  sprintName: string;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  totalStoryPoints: number;
  completedPoints: number;
  remainingPoints: number;
  velocityRate: number;
  totalTasks: number;
  completedTasks: number;
  avgCycleTimeDays: number;
}

export interface ProjectReportData {
  summary: SprintMetricsSummary;
  burndown: BurndownPoint[];
  team: TeamMemberVelocity[];
  categories: CategoryBreakdown[];
  sprintHistory: SprintHistoryItem[];
}
