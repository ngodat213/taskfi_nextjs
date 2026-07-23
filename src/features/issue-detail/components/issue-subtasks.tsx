import { useState } from "react";
import {
  useIssueChildren,
  useIssues,
  useUpdateIssue,
} from "@/features/projects/hooks/use-issues";
import { Button, ButtonVariant } from "@/components/ui/actions/button";
import { IssueStatus, IssueType } from "@/types/issue.types";
import {
  TypeIcon,
  StatusBadge,
} from "@/features/dashboard/components/issue-table-row";
import { cn } from "@/utils/cn";
import { EmptyState } from "@/components/ui/data-display/empty-state";
import { CreateTaskModal } from "@/features/dashboard/components/create-task-modal";
import { Select } from "@/components/ui/forms/select";

interface IssueSubtasksProps {
  projectId: string;
  parentId: string;
}

export function IssueSubtasks({ projectId, parentId }: IssueSubtasksProps) {
  const [isCreateSubtaskOpen, setIsCreateSubtaskOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Subtasks
          </h3>
          <div className="flex items-center gap-1.5">
            <Select
              value=""
              onChange={(val) => {
                if (val) {
                  updateIssue.mutate({
                    projectId,
                    issueId: val,
                    data: { parentId },
                  });
                }
              }}
              className="h-6 text-[11px] min-w-[140px] font-medium"
              searchable
              onSearchChange={setSearchQuery}
            >
              <option value="">+ Link existing</option>
              {allIssues
                .filter((i) => i.id !== parentId)
                .map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.issueKey} - {i.summary}
                  </option>
                ))}
            </Select>
            <Button
              variant={ButtonVariant.Ghost}
              className="h-6 text-[11px] px-2 py-0 font-medium text-muted-foreground hover:bg-secondary shrink-0 border border-border/40"
              onClick={() => setIsCreateSubtaskOpen(true)}
            >
              + Create subtask
            </Button>
          </div>
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
            description="Create subtasks to break down this issue."
            className="py-4 px-5 sm:p-4 bg-muted/50 border border-border/60 rounded-xl"
          />
        ) : (
          <div className="flex flex-col gap-1.5 p-2 bg-muted/50 rounded-xl border border-border/60">
            {subtasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between py-1.5 px-2.5 bg-card hover:bg-muted rounded-lg border border-border/60 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2 overflow-hidden flex-1">
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
                      task.status === IssueStatus.DONE
                        ? "text-muted-foreground line-through"
                        : "text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400",
                    )}
                  >
                    {task.summary}
                  </span>
                </div>
                <div className="flex items-center shrink-0 ml-3 mr-1">
                  <StatusBadge status={task.status as IssueStatus} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateTaskModal
        isOpen={isCreateSubtaskOpen}
        onClose={() => setIsCreateSubtaskOpen(false)}
        projectId={projectId}
        parentId={parentId}
      />
    </>
  );
}
