export type DependencyType = "blocks" | "blocked_by" | "relies_on";

export type DependencyRiskLevel = "critical" | "warning" | "resolved";

export interface DependencyItem {
  id: string;
  sourceIssueKey: string;
  sourceIssueSummary: string;
  sourceAssigneeName: string;
  sourceAssigneeAvatar?: string;
  sourceStatus: "Todo" | "In Progress" | "In Review" | "Done";

  targetIssueKey: string;
  targetIssueSummary: string;
  targetAssigneeName: string;
  targetAssigneeAvatar?: string;
  targetStatus: "Todo" | "In Progress" | "In Review" | "Done";

  type: DependencyType;
  riskLevel: DependencyRiskLevel;
  updatedAt: string;
}
