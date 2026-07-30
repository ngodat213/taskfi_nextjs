export type DependencyType = "blocks" | "blocked_by" | "relies_on";

export type DependencyRiskLevel = "critical" | "warning" | "resolved";

export interface DependencyItem {
  id: string;
  sourceIssueId?: string;
  sourceIssueKey: string;
  sourceIssueSummary: string;
  sourceType?: string;
  sourceAssigneeName: string;
  sourceAssigneeAvatar?: string;
  sourceStatus: "Todo" | "In Progress" | "In Review" | "Done";

  targetIssueId?: string;
  targetIssueKey: string;
  targetIssueSummary: string;
  targetType?: string;
  targetAssigneeName: string;
  targetAssigneeAvatar?: string;
  targetStatus: "Todo" | "In Progress" | "In Review" | "Done";

  type: DependencyType;
  riskLevel: DependencyRiskLevel;
  updatedAt: string;
}
