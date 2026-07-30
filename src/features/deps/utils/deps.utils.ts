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
  const s = status.toLowerCase().replace(/[-_]/g, " ").trim();
  if (s.includes("done") || s.includes("complete")) return "Done";
  if (s.includes("progress") || s.includes("doing") || s.includes("dev"))
    return "In Progress";
  if (s.includes("review") || s.includes("testing") || s.includes("qa"))
    return "In Review";
  return "Todo";
}

/**
 * Checks whether an issue status matches selected status filters
 */
export function isStatusSelected(
  issueStatus?: string,
  selectedStatuses?: string[],
): boolean {
  if (!selectedStatuses) return true;
  if (selectedStatuses.length === 0) return false;

  const normIssueStatus = normalizeIssueStatus(issueStatus);

  return selectedStatuses.some((sel) => {
    return normalizeIssueStatus(sel) === normIssueStatus;
  });
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
export function getAssigneeName(issue?: Issue | null): string {
  if (!issue) return "Chưa phân công";
  return (
    issue.assignee?.name ||
    (issue.assignee as unknown as { fullName?: string })?.fullName ||
    issue.assignee?.username ||
    issue.assignee?.email ||
    (typeof issue.assigneeId === "string" ? issue.assigneeId : "") ||
    "Chưa phân công"
  );
}

export function getAssigneeAvatar(issue?: Issue | null): string | undefined {
  if (!issue) return undefined;
  return (
    issue.assignee?.avatarUrl ||
    (issue.assignee as unknown as { avatar?: string })?.avatar
  );
}

export function mapIssuesToDependencies(issues: Issue[]): DependencyItem[] {
  if (!issues || issues.length === 0) return [];

  const issueMap = new Map(issues.map((i) => [i.id, i]));
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
            sourceIssueId: issue.id,
            sourceIssueKey: issue.issueKey || `TSK-${issue.id.slice(0, 4)}`,
            sourceIssueSummary: issue.summary || "Untitled Issue",
            sourceType: issue.type,
            sourceAssigneeName: getAssigneeName(issue),
            sourceAssigneeAvatar: getAssigneeAvatar(issue),
            sourceStatus: normalizeIssueStatus(issue.status),

            targetIssueId: target.id,
            targetIssueKey: target.issueKey || `TSK-${target.id.slice(0, 4)}`,
            targetIssueSummary: target.summary || "Untitled Issue",
            targetType: target.type,
            targetAssigneeName: getAssigneeName(target),
            targetAssigneeAvatar: getAssigneeAvatar(target),
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
          sourceIssueId: parent.id,
          sourceIssueKey: parent.issueKey || `TSK-${parent.id.slice(0, 4)}`,
          sourceIssueSummary: parent.summary || "Untitled Issue",
          sourceType: parent.type,
          sourceAssigneeName: getAssigneeName(parent),
          sourceAssigneeAvatar: getAssigneeAvatar(parent),
          sourceStatus: normalizeIssueStatus(parent.status),

          targetIssueId: issue.id,
          targetIssueKey: issue.issueKey || `TSK-${issue.id.slice(0, 4)}`,
          targetIssueSummary: issue.summary || "Untitled Issue",
          targetType: issue.type,
          targetAssigneeName: getAssigneeName(issue),
          targetAssigneeAvatar: getAssigneeAvatar(issue),
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
