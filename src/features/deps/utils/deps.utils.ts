import { Issue } from "@/types/issue.types";
import {
  DependencyItem,
  DependencyRiskLevel,
  DependencyType,
} from "@/features/deps/types/deps.types";

/**
 * Normalizes issue status string into a clean UI status type
 */
export function normalizeIssueStatus(
  status?: string,
): "Todo" | "In Progress" | "In Review" | "Done" {
  if (!status) return "Todo";
  const s = status.toLowerCase();
  if (s === "done" || s === "completed") return "Done";
  if (s === "in progress" || s === "in_progress") return "In Progress";
  if (s === "in review" || s === "in_review") return "In Review";
  return "Todo";
}

/**
 * Calculates risk level of a dependency relation
 */
export function calculateDependencyRiskLevel(
  issue: Issue,
  linkType?: string,
): DependencyRiskLevel {
  const pLower = (issue.priority || "").toLowerCase();
  const sLower = (issue.status || "").toLowerCase();

  if (pLower === "critical" || pLower === "high" || linkType === "blocks") {
    return "critical";
  }
  if (sLower !== "done" && sLower !== "completed") {
    return "warning";
  }
  return "resolved";
}

/**
 * Formats raw link types (e.g., blocks, causes, relates_to) into Vietnamese labels
 */
export function formatDependencyLabel(linkType: string): string {
  if (linkType === "blocks" || linkType === "is_blocked_by") {
    return "Chặn công việc";
  }
  if (linkType === "subtask") {
    return "Tác vụ con";
  }
  if (linkType === "relates_to") {
    return "Liên quan";
  }
  if (linkType.includes("cause")) {
    return "Nguyên nhân";
  }
  if (linkType.includes("duplicate")) {
    return "Trùng lặp";
  }
  if (linkType.includes("clone")) {
    return "Bản sao";
  }
  return "Phụ thuộc";
}

/**
 * Maps raw API Issues into a structured list of DependencyItem
 */
export function mapIssuesToDependencies(issues: Issue[]): DependencyItem[] {
  if (!issues || issues.length === 0) return [];
  const issueMap = new Map(issues.map((item) => [item.id, item]));
  const items: DependencyItem[] = [];

  issues.forEach((issue) => {
    // 1. Process explicit issue links
    if (Array.isArray(issue.links)) {
      issue.links.forEach((link, idx) => {
        const targetId = typeof link === "string" ? link : link.targetIssueId;
        const linkType =
          typeof link === "string" ? "blocks" : link.type || "blocks";
        const target = issueMap.get(targetId);

        if (target) {
          const riskLevel = calculateDependencyRiskLevel(issue, linkType);
          const type: DependencyType =
            linkType === "blocks" ? "blocks" : "relies_on";

          items.push({
            id: `dep-${issue.id}-${target.id}-${idx}`,
            sourceIssueKey: issue.issueKey || `TSK-${issue.id.slice(0, 4)}`,
            sourceIssueSummary: issue.summary || "Untitled Issue",
            sourceAssigneeName: issue.assigneeId || "Chưa phân công",
            sourceAssigneeAvatar: undefined,
            sourceStatus: normalizeIssueStatus(issue.status),

            targetIssueKey: target.issueKey || `TSK-${target.id.slice(0, 4)}`,
            targetIssueSummary: target.summary || "Untitled Issue",
            targetAssigneeName: target.assigneeId || "Chưa phân công",
            targetAssigneeAvatar: undefined,
            targetStatus: normalizeIssueStatus(target.status),

            type,
            riskLevel,
            updatedAt: "Just now",
          });
        }
      });
    }

    // 2. Process parent-child subtask dependencies
    if (issue.parentId) {
      const parent = issueMap.get(issue.parentId);
      if (parent) {
        items.push({
          id: `subtask-${parent.id}-${issue.id}`,
          sourceIssueKey: parent.issueKey || `TSK-${parent.id.slice(0, 4)}`,
          sourceIssueSummary: parent.summary || "Untitled Issue",
          sourceAssigneeName: parent.assigneeId || "Chưa phân công",
          sourceAssigneeAvatar: undefined,
          sourceStatus: normalizeIssueStatus(parent.status),

          targetIssueKey: issue.issueKey || `TSK-${issue.id.slice(0, 4)}`,
          targetIssueSummary: issue.summary || "Untitled Issue",
          targetAssigneeName: issue.assigneeId || "Chưa phân công",
          targetAssigneeAvatar: undefined,
          targetStatus: normalizeIssueStatus(issue.status),

          type: "relies_on",
          riskLevel: "resolved",
          updatedAt: "Just now",
        });
      }
    }
  });

  return items;
}
