import { SearchSelectOption } from "@/components/ui/forms/search-select";
import { Issue, IssueType, IssueStatus } from "@/types/issue.types";
import {
  TypeIcon,
  StatusBadge,
} from "@/features/dashboard/components/issue-table-row";
import { WorkspaceConfig, WorkspaceMember } from "@/types/workspace.types";
import { DEFAULT_RELATIONSHIP_OPTIONS } from "@/features/issue-detail/constants/issue-detail.constants";

export function mapIssueToSearchOption(
  issue:
    | Issue
    | {
        id: string;
        type: string;
        issueKey: string;
        summary: string;
        status: string;
      },
): SearchSelectOption {
  return {
    value: issue.id,
    label: `${issue.issueKey} - ${issue.summary}`,
    icon: (
      <TypeIcon
        type={issue.type as IssueType}
        className="w-3.5 h-3.5 shrink-0"
      />
    ),
    badge: <StatusBadge status={issue.status as IssueStatus} />,
  };
}

export function getLinkTargetId(
  linkItem: string | { targetIssueId: string },
): string {
  return typeof linkItem === "string" ? linkItem : linkItem.targetIssueId;
}

export function resolveRelationshipOptions(
  workspaceConfig?: WorkspaceConfig,
): SearchSelectOption[] {
  if (workspaceConfig?.linkTypes && workspaceConfig.linkTypes.length > 0) {
    return workspaceConfig.linkTypes.map((linkType) => ({
      value: linkType.type,
      label: linkType.outwardLabel || linkType.type,
    }));
  }
  return DEFAULT_RELATIONSHIP_OPTIONS;
}

export function buildMemberOptions(
  members: WorkspaceMember[],
  currentAssigneeId?: string,
  assigneeUser?: { name?: string; username?: string; email?: string },
  currentReporterId?: string,
  reporterUser?: { name?: string; username?: string; email?: string },
): { value: string; label: string }[] {
  const options = members.map((m) => ({
    value: m.userId || m.id,
    label: m.name || m.username || m.fullName || m.email || m.userId || m.id,
  }));

  if (
    currentAssigneeId &&
    !options.some((m) => m.value === currentAssigneeId)
  ) {
    options.unshift({
      value: currentAssigneeId,
      label:
        assigneeUser?.name ||
        assigneeUser?.username ||
        assigneeUser?.email ||
        currentAssigneeId,
    });
  }

  if (
    currentReporterId &&
    !options.some((m) => m.value === currentReporterId)
  ) {
    options.unshift({
      value: currentReporterId,
      label:
        reporterUser?.name ||
        reporterUser?.username ||
        reporterUser?.email ||
        currentReporterId,
    });
  }

  return options;
}
