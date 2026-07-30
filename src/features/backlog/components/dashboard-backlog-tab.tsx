import React from "react";
import { Issue } from "@/types/issue.types";
import { IssueListTab } from "@/features/issues/components/issue-list-tab";
import { useWorkspaceConfig } from "@/features/workspaces/hooks/use-workspaces";
import { useWorkspaceStore } from "@/store/workspace.store";

interface DashboardBacklogTabProps {
  q?: string;
  issues?: Issue[];
  isLoading?: boolean;
  onIssueClick?: (
    issueId: string,
    issueData?: { issueKey?: string; type?: string },
  ) => void;
}

const EMPTY_ISSUES: Issue[] = [];

export function DashboardBacklogTab({
  q,
  issues = EMPTY_ISSUES,
  isLoading,
  onIssueClick,
}: DashboardBacklogTabProps) {
  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId,
  );
  const { data: configResponse } = useWorkspaceConfig(
    activeWorkspaceId as string,
  );

  const backlogStatusNames = React.useMemo(() => {
    if (
      configResponse?.data?.statuses &&
      configResponse.data.statuses.length > 0
    ) {
      const nonDone = configResponse.data.statuses.filter(
        (s) => s.category !== "DONE" && !s.name.toLowerCase().includes("done"),
      );
      if (nonDone.length > 0) {
        return nonDone.map((s) => s.name.toLowerCase());
      }
    }
    return [
      "to do",
      "todo",
      "in progress",
      "in_progress",
      "in review",
      "in_review",
    ];
  }, [configResponse]);

  const filteredIssues = React.useMemo(() => {
    const list = issues || EMPTY_ISSUES;
    return list
      .filter((i) =>
        backlogStatusNames.includes((i.status || "").toLowerCase()),
      )
      .filter((i) => !q || i.summary.toLowerCase().includes(q.toLowerCase()));
  }, [issues, q, backlogStatusNames]);

  return (
    <IssueListTab
      title="Sprint Backlog"
      subtitle={`${filteredIssues.length} issues remaining`}
      issues={filteredIssues}
      isLoading={isLoading}
      onIssueClick={onIssueClick}
    />
  );
}
