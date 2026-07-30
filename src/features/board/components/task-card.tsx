"use client";

import Image from "next/image";
import { getInitials } from "@/utils/string";
import { Tooltip } from "@/components/ui/feedback/tooltip";
import { Badge } from "@/components/ui/data-display/badge";
import { PriorityBadge } from "@/components/ui/data-display/priority-badge";
import { ItemCard } from "@/components/ui/data-display/item-card";
import { Issue } from "@/types/issue.types";
import { TypeIcon } from "@/features/issues/components/issue-table-row";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { PaginatedResponse } from "@/types/api.types";

interface TaskCardProps {
  issue: Issue;
  onIssueClick?: (
    issueId: string,
    issueData?: { issueKey?: string; type?: string },
  ) => void;
  className?: string;
}

const TYPE_BADGE_VARIANTS: Record<
  string,
  "emerald" | "blue" | "red" | "slate"
> = {
  story: "emerald",
  task: "blue",
  bug: "red",
};

export function TaskCard({ issue, onIssueClick, className }: TaskCardProps) {
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

  const assigneeAvatarUrl = issue.assignee?.avatarUrl;
  const assigneeName = issue.assignee?.name;
  const assigneeDisplay = assigneeName
    ? getInitials(assigneeName)
    : issue.assigneeId
      ? issue.assigneeId.substring(0, 2).toUpperCase()
      : "UN";

  return (
    <ItemCard
      onClick={() => onIssueClick && onIssueClick(issue.id, issue)}
      className={className}
      icon={<TypeIcon type={type as Issue["type"]} className="w-4 h-4" />}
      itemKey={displayId}
      badge={
        <Badge
          variant={TYPE_BADGE_VARIANTS[type] || "slate"}
          className="capitalize text-[10px]"
        >
          {type}
        </Badge>
      }
      subHeader={
        parentIssue ? (
          <>
            <TypeIcon
              type={parentIssue.type as Issue["type"]}
              className="w-3 h-3 opacity-70 shrink-0"
            />
            <span className="hover:underline hover:text-foreground cursor-pointer transition-colors shrink-0">
              {parentIssue.issueKey}
            </span>
            <span className="text-muted-foreground/40 shrink-0">/</span>
            <span className="truncate">{parentIssue.summary}</span>
          </>
        ) : undefined
      }
      title={issue.summary}
      footerLeft={<PriorityBadge priority={priority} />}
      footerRight={
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
    />
  );
}
