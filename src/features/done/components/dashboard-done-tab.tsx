import React from "react";
import { Issue } from "@/types/issue.types";
import { IssueListTab } from "@/features/issues/components/issue-list-tab";
import { useWorkspaceConfig } from "@/features/workspaces/hooks/use-workspaces";
import { useWorkspaceStore } from "@/store/workspace.store";

interface DashboardDoneTabProps {
  q: string;
  issues?: Issue[];
  isLoading?: boolean;
  onIssueClick?: (issueId: string) => void;
}

const EMPTY_ISSUES: Issue[] = [];

export function DashboardDoneTab({
  q,
  issues = EMPTY_ISSUES,
  isLoading,
  onIssueClick,
}: DashboardDoneTabProps) {
  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId,
  );
  const { data: configResponse } = useWorkspaceConfig(
    activeWorkspaceId as string,
  );

  const doneStatusNames = React.useMemo(() => {
    if (
      configResponse?.data?.statuses &&
      configResponse.data.statuses.length > 0
    ) {
      const doneStatuses = configResponse.data.statuses.filter(
        (s) => s.category === "DONE" || s.name.toLowerCase().includes("done"),
      );
      if (doneStatuses.length > 0) {
        return doneStatuses.map((s) => s.name.toLowerCase());
      }
    }
    return ["done"];
  }, [configResponse]);

  const filteredIssues = React.useMemo(() => {
    const list = issues || EMPTY_ISSUES;
    return list
      .filter((i) => doneStatusNames.includes((i.status || "").toLowerCase()))
      .filter((i) => !q || i.summary.toLowerCase().includes(q.toLowerCase()));
  }, [issues, q, doneStatusNames]);

  return (
    <IssueListTab
      title="Done Tracker"
      subtitle={`${filteredIssues.length} completed items`}
      issues={filteredIssues}
      isLoading={isLoading}
      onIssueClick={onIssueClick}
    />
  );
}
