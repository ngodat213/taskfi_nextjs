import { useMemo } from "react";

import Image from "next/image";

import { useQueryClient } from "@tanstack/react-query";

import { Badge } from "@/components/ui/data-display/badge";
import { PriorityBadge } from "@/components/ui/data-display/priority-badge";
import {
  DueDatePill,
  SubtaskProgressRing,
} from "@/components/ui/data-display/task-card-pills";
import { TypeBadge } from "@/components/ui/data-display/type-badge";
import { Tooltip } from "@/components/ui/feedback/tooltip";
import { TypeIcon } from "@/features/dashboard/components/issue-table-row";
import {
  TYPE_BORDER_CLASSES,
  getTypeOrStatusColor,
} from "@/features/dashboard/constants/issue-ui.constants";
import { useProject } from "@/features/projects/hooks/use-project";
import { useWorkspaceConfig } from "@/features/workspaces/hooks/use-workspaces";
import { PaginatedResponse } from "@/types/api.types";
import { Issue } from "@/types/issue.types";
import { cn } from "@/utils/cn";
import { getInitials } from "@/utils/string";

interface TaskCardProps {
  issue: Issue;
  onIssueClick?: (issueId: string) => void;
}

export function TaskCard({ issue, onIssueClick }: TaskCardProps) {
  const queryClient = useQueryClient();

  const { data: projectResponse } = useProject(issue.projectId);
  const workspaceId =
    issue.project?.workspaceId || projectResponse?.data?.workspaceId || "";
  const { data: configResponse } = useWorkspaceConfig(workspaceId);
  const workspaceConfig = configResponse?.data;

  const dynamicColor = useMemo(() => {
    return getTypeOrStatusColor(issue.type, issue.status, workspaceConfig);
  }, [issue.type, issue.status, workspaceConfig]);

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

  const childSubtasks = useMemo(() => {
    if (issue.children && issue.children.length > 0) {
      return issue.children;
    }

    const queries = queryClient.getQueriesData<PaginatedResponse<Issue>>({
      queryKey: ["issues", issue.projectId],
    });

    const foundChildren: Issue[] = [];
    for (const [, data] of queries) {
      if (data?.data?.data) {
        for (const i of data.data.data) {
          if (i.parentId === issue.id) {
            foundChildren.push(i);
          }
        }
      }
    }
    return foundChildren;
  }, [issue.children, issue.id, issue.projectId, queryClient]);

  const totalSubtasks = childSubtasks.length;
  const completedSubtasks = useMemo(() => {
    return childSubtasks.filter(
      (c) => (c.status || "").toLowerCase() === "done",
    ).length;
  }, [childSubtasks]);

  const displayId = issue.issueKey || issue.id || "";
  const type = (issue.type || "task").toLowerCase();
  const priority = issue.priority || "Medium";

  const assigneeAvatarUrl = issue.assignee?.avatarUrl;
  const assigneeName = issue.assignee?.name;
  const assigneeDisplay = assigneeName
    ? getInitials(assigneeName)
    : issue.assigneeId
      ? issue.assigneeId.substring(0, 2).toUpperCase()
      : "UN";

  const isCompleted = (issue.status || "").toLowerCase() === "done";

  return (
    <div
      className="bg-card p-2.5 rounded-lg border border-border/80 hover:border-primary/40 hover:shadow-md active:scale-[0.98] cursor-pointer group transition-all duration-200 ease-out select-none"
      onClick={() => onIssueClick && onIssueClick(issue.id)}
    >
      <div className="flex items-center justify-between mb-1.5 min-w-0">
        <div className="flex items-center gap-1 min-w-0 pr-2">
          {parentIssue ? (
            <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate min-w-0">
              <span className="shrink-0">{parentIssue.issueKey}</span>
              <span className="text-muted-foreground/60 shrink-0">›</span>
              <span className="shrink-0">{displayId}</span>
              <span className="text-muted-foreground/40 shrink-0">·</span>
              <span className="truncate">{parentIssue.summary}</span>
            </div>
          ) : (
            <span className="text-[12.5px] font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
              {displayId}
            </span>
          )}
        </div>
        <Tooltip
          content={
            assigneeName ||
            (issue.assigneeId ? `Assignee: ${issue.assigneeId}` : "Unassigned")
          }
        >
          <div className="relative w-5 h-5 rounded-full bg-secondary border border-border flex items-center justify-center text-[8.5px] font-bold text-muted-foreground overflow-hidden shrink-0">
            {assigneeAvatarUrl ? (
              <Image
                src={assigneeAvatarUrl}
                alt={assigneeName || "Assignee"}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              assigneeDisplay
            )}
          </div>
        </Tooltip>
      </div>

      <p className="text-[12.5px] text-foreground font-medium leading-snug mb-2.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {issue.summary}
      </p>

      <div className="flex items-center justify-between mt-auto gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
          <TypeBadge type={type} color={dynamicColor} />
          <PriorityBadge priority={priority} />
          <DueDatePill dueDate={issue.dueDate} isCompleted={isCompleted} />
          <SubtaskProgressRing
            completed={completedSubtasks}
            total={totalSubtasks}
          />
        </div>
      </div>
    </div>
  );
}
