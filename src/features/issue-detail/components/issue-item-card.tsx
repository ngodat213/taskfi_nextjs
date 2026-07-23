import { X } from "@phosphor-icons/react/dist/ssr";
import { Button, ButtonVariant } from "@/components/ui/actions/button";
import { Issue, IssueStatus, IssueType } from "@/types/issue.types";
import {
  TypeIcon,
  StatusBadge,
} from "@/features/dashboard/components/issue-table-row";
;

interface IssueItemCardProps {
  issue:
    | Issue
    | {
        id: string;
        type: string;
        issueKey: string;
        summary: string;
        status: string;
      };
  onRemove?: () => void;
}

export function IssueItemCard({ issue, onRemove }: IssueItemCardProps) {
  return (
    <div className="flex items-center justify-between p-2 w-full bg-muted/50 rounded-xl border border-border/60 shadow-sm group">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <TypeIcon type={issue.type as IssueType} />
        <span className="text-[12px] font-semibold text-muted-foreground shrink-0">
          {issue.issueKey}
        </span>
        <span className="text-[13px] font-medium text-foreground truncate">
          {issue.summary}
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-3">
        <StatusBadge status={issue.status as IssueStatus} />
        {onRemove && (
          <Button
            variant={ButtonVariant.Ghost}
            className="h-6 w-6 p-0 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 transition-all"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }}
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
