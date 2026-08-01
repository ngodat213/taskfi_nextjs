"use client";

import { useMemo } from "react";

import Image from "next/image";

import { useQueryClient } from "@tanstack/react-query";

import { ItemCard } from "@/components/ui/data-display/item-card";
import { PriorityBadge } from "@/components/ui/data-display/priority-badge";
import {
  DueDatePill,
  SubtaskProgressRing,
} from "@/components/ui/data-display/task-card-pills";
import { TypeBadge } from "@/components/ui/data-display/type-badge";
import { Tooltip } from "@/components/ui/feedback/tooltip";
import { getTypeOrStatusColor } from "@/features/issues/constants/issue-ui.constants";
import { useProject } from "@/features/projects/hooks/use-project";
import { useWorkspaceConfig } from "@/features/workspaces/hooks/use-workspaces";
import { PaginatedResponse } from "@/types/api.types";
import { Issue } from "@/types/issue.types";
import { getInitials } from "@/utils/string";

interface TaskCardProps {
  issue: Issue;
  onIssueClick?: (
    issueId: string,
    issueData?: { issueKey?: string; type?: string },
  ) => void;
  className?: string;
}

export function TaskCard({ issue, onIssueClick, className }: TaskCardProps) {
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
    <ItemCard
      onClick={() => onIssueClick && onIssueClick(issue.id, issue)}
      className={className}
      itemKey={
        parentIssue ? (
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
        )
      }
      badge={
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
      }
      title={issue.summary}
      footerLeft={
        <div className="flex items-center gap-1.5 flex-wrap">
          <TypeBadge type={type} color={dynamicColor} />
          <PriorityBadge priority={priority} />
          <DueDatePill dueDate={issue.dueDate} isCompleted={isCompleted} />
          <SubtaskProgressRing
            completed={completedSubtasks}
            total={totalSubtasks}
          />
        </div>
      }
    />
  );
}
