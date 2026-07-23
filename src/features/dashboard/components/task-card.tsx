import {
  WarningCircle,
  CaretUp,
  Equals,
  CaretDown,
} from "@phosphor-icons/react/dist/ssr";
import { Badge } from "@/components/ui/data-display/badge";
import { Issue } from "@/types/issue.types";
import { TypeIcon } from "@/features/dashboard/components/issue-table-row";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { PaginatedResponse } from "@/types/api.types";

interface TaskCardProps {
  issue: Issue;
  onIssueClick?: (issueId: string) => void;
}

export function TaskCard({ issue, onIssueClick }: TaskCardProps) {
  const queryClient = useQueryClient();

  const parentIssue = useMemo(() => {
    if (!issue.parentId) return null;

    // Look through all cached issues for this project
    const queries = queryClient.getQueriesData<PaginatedResponse<Issue>>({
      queryKey: ["issues", issue.projectId],
    });

    for (const [, data] of queries) {
      if (data?.data?.data) {
        const found = data.data.data.find((i) => i.id === issue.parentId);
        if (found) return found;
      }
    }

    const singleIssue = queryClient.getQueryData<{ data: Issue }>([
      "issues",
      issue.projectId,
      issue.parentId,
    ]);
    if (singleIssue?.data) return singleIssue.data;

    return null;
  }, [issue.parentId, issue.projectId, queryClient]);

  const displayId = issue.issueKey || issue.id || "";
  const type = (issue.type || "task").toLowerCase();
  const priority = issue.priority || "Medium";
  const assigneeDisplay = issue.assigneeId
    ? issue.assigneeId.substring(0, 2).toUpperCase()
    : "UN";

  return (
    <div
      className="bg-card p-2.5 rounded-lg border border-border/80 hover:border-primary/40 hover:shadow-md active:scale-[0.98] cursor-pointer group transition-all duration-200 ease-out select-none"
      onClick={() => onIssueClick && onIssueClick(issue.id)}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <TypeIcon type={type as Issue["type"]} className="w-4 h-4" />
          <span className="text-[12.5px] font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
            {displayId}
          </span>
        </div>
        <Badge
          variant={
            type === "story"
              ? "emerald"
              : type === "task"
                ? "blue"
                : type === "bug"
                  ? "red"
                  : "slate"
          }
          className="capitalize"
        >
          {type}
        </Badge>
      </div>

      {parentIssue && (
        <div className="flex items-center gap-1.5 mb-2 w-fit max-w-full text-[11px] font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md border border-border/50">
          <TypeIcon
            type={parentIssue.type as Issue["type"]}
            className="w-3 h-3 opacity-70 shrink-0"
          />
          <span className="hover:underline hover:text-foreground cursor-pointer transition-colors shrink-0">
            {parentIssue.issueKey}
          </span>
          <span className="text-muted-foreground/40 shrink-0">/</span>
          <span className="truncate">{parentIssue.summary}</span>
        </div>
      )}

      <p className="text-[12.5px] text-foreground font-medium leading-snug mb-2.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {issue.summary}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <Badge
          variant={
            priority.toLowerCase() === "critical"
              ? "red"
              : priority.toLowerCase() === "high"
                ? "orange"
                : priority.toLowerCase() === "medium"
                  ? "amber"
                  : "blue"
          }
          className="uppercase tracking-wider text-[10px]"
        >
          {priority.toLowerCase() === "critical" && (
            <WarningCircle className="w-3 h-3" />
          )}
          {priority.toLowerCase() === "high" && <CaretUp className="w-3 h-3" />}
          {priority.toLowerCase() === "medium" && (
            <Equals className="w-3 h-3" />
          )}
          {priority.toLowerCase() === "low" && (
            <CaretDown className="w-3 h-3" />
          )}
          {priority}
        </Badge>

        <div className="w-5 h-5 rounded-full bg-secondary border border-border flex items-center justify-center text-[8.5px] font-bold text-muted-foreground overflow-hidden">
          {assigneeDisplay}
        </div>
      </div>
    </div>
  );
}
