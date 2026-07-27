import { useState } from "react";
import { X } from "@phosphor-icons/react/dist/ssr";
import { Button, ButtonVariant } from "@/components/ui/actions/button";
import {
  useIssueChildren,
  useIssues,
  useUpdateIssue,
} from "@/features/projects/hooks/use-issues";
import { IssueType, IssueStatus } from "@/types/issue.types";
import {
  TypeIcon,
  StatusBadge,
} from "@/features/dashboard/components/issue-table-row";
import { cn } from "@/utils/cn";
import { EmptyState } from "@/components/ui/data-display/empty-state";
import { SearchSelect } from "@/components/ui/forms/search-select";
import { ErrorTooltip } from "@/components/ui/feedback/error-tooltip";
import { useAutoError } from "@/hooks/use-auto-error";

interface IssueSubtasksProps {
  projectId: string;
  parentId: string;
}

export function IssueSubtasks({ projectId, parentId }: IssueSubtasksProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { fieldErrors, handleApiError, clearFieldError } = useAutoError();

  const updateIssue = useUpdateIssue();
  const { data: issuesResponse } = useIssues(projectId, {
    limit: 50,
    search: searchQuery || undefined,
    hasParent: false,
  });
  const allIssues = issuesResponse?.data?.data || [];

  const { data: childrenResponse, isLoading: isLoadingChildren } =
    useIssueChildren(projectId, parentId);
  const subtasks = childrenResponse?.data || [];

  const searchOptions = allIssues
    .filter((i) => i.id !== parentId)
    .map((i) => ({
      value: i.id,
      label: `${i.issueKey} - ${i.summary}`,
      icon: (
        <TypeIcon type={i.type as IssueType} className="w-3.5 h-3.5 shrink-0" />
      ),
      badge: <StatusBadge status={i.status as IssueStatus} />,
    }));

  const handleRemoveSubtask = (issueId: string) => {
    clearFieldError("subtask");
    updateIssue.mutate(
      {
        projectId,
        issueId,
        data: { parentId: null },
      },
      {
        onError: (err) => handleApiError(err, "subtask"),
      },
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Subtasks
        </h3>
      </div>

      <div className="mb-3 relative">
        <SearchSelect
          options={searchOptions}
          value=""
          onChange={(val) => {
            if (val) {
              clearFieldError("subtask");
              updateIssue.mutate(
                {
                  projectId,
                  issueId: val,
                  data: { parentId },
                },
                {
                  onError: (err) => handleApiError(err, "subtask"),
                },
              );
            }
          }}
          placeholder="+ Add or attach subtask..."
          onSearchChange={setSearchQuery}
        />
        <ErrorTooltip message={fieldErrors.subtask || fieldErrors.parentId} />
      </div>

      {isLoadingChildren ? (
        <div className="flex flex-col gap-1.5 p-2 bg-muted/50 rounded-xl border border-border/60">
          <div className="p-4 text-center text-sm text-muted-foreground">
            Loading subtasks...
          </div>
        </div>
      ) : subtasks.length === 0 ? (
        <EmptyState
          title="No subtasks yet"
          description="Create or attach subtasks to break down this issue."
          className="py-4 px-5 sm:p-4 bg-muted/50 border border-border/60 rounded-xl"
        />
      ) : (
        <div className="flex flex-col gap-1.5 p-2 bg-muted/50 rounded-xl border border-border/60">
          {subtasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between py-1.5 px-2.5 bg-card hover:bg-muted rounded-lg border border-border/60 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
                <TypeIcon
                  type={task.type as IssueType}
                  className="w-4 h-4 shrink-0"
                />
                <span className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider group-hover:text-foreground transition-colors shrink-0">
                  {task.issueKey}
                </span>
                <span
                  className={cn(
                    "text-[13px] font-medium tracking-tight transition-colors line-clamp-1 ml-1",
                    task.status?.toLowerCase() === "done" || task.status === "Done"
                      ? "text-muted-foreground line-through"
                      : "text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400",
                  )}
                >
                  {task.summary}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-3">
                <StatusBadge status={task.status as IssueStatus} />
                <Button
                  variant={ButtonVariant.Ghost}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all shrink-0"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemoveSubtask(task.id);
                  }}
                  title="Remove subtask"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
