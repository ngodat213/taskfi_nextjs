import { SearchSelectOption } from "@/components/ui/forms/search-select";
import { Issue, IssueType, IssueStatus } from "@/types/issue.types";
import {
  TypeIcon,
  StatusBadge,
} from "@/features/dashboard/components/issue-table-row";

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
