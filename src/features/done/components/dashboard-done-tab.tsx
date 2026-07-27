import React from "react";
import { Issue } from "@/types/issue.types";
import { IssueListTab } from "@/features/issues/components/issue-list-tab";

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
  const filteredIssues = React.useMemo(() => {
    const list = issues || EMPTY_ISSUES;
    return list
      .filter((i) => i.status?.toLowerCase() === "done")
      .filter((i) => !q || i.summary.toLowerCase().includes(q.toLowerCase()));
  }, [issues, q]);

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
