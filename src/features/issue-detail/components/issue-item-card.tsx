import { XIcon } from "@phosphor-icons/react/dist/ssr";

import { Button, ButtonVariant } from "@/components/ui/actions/button";
import {
  StatusBadge,
  TypeIcon,
} from "@/features/dashboard/components/issue-table-row";
import { Issue, IssueStatus, IssueType } from "@/types/issue.types";
import { cn } from "@/utils/cn";

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
  onClick?: () => void;
  className?: string;
}

export function IssueItemCard({
  issue,
  onRemove,
  onClick,
  className,
}: IssueItemCardProps) {
  const isDone = (issue.status || "").toLowerCase() === "done";

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center justify-between w-full h-9 px-2.5 bg-card hover:bg-muted rounded-lg border border-border/60 transition-colors cursor-pointer group",
        className,
      )}
    >
      <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
        <TypeIcon type={issue.type as IssueType} className="w-4 h-4 shrink-0" />
        <span className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider group-hover:text-foreground transition-colors shrink-0">
          {issue.issueKey}
        </span>
        <span
          className={cn(
            "text-[13px] font-medium tracking-tight transition-colors line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400",
            isDone ? "line-through text-muted-foreground" : "text-foreground",
          )}
        >
          {issue.summary}
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-3">
        <StatusBadge status={issue.status as IssueStatus} />
        {onRemove && (
          <Button
            variant={ButtonVariant.Ghost}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all shrink-0"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }}
          >
            <XIcon className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
