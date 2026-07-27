import React from "react";
import { Issue } from "@/types/issue.types";
import { IssueListTab } from "@/features/issues/components/issue-list-tab";

interface DashboardBacklogTabProps {
  q?: string;
  issues?: Issue[];
  isLoading?: boolean;
  onIssueClick?: (issueId: string) => void;
}

const EMPTY_ISSUES: Issue[] = [];

export function DashboardBacklogTab({
  q,
  issues = EMPTY_ISSUES,
  isLoading,
  onIssueClick,
}: DashboardBacklogTabProps) {
  const filteredIssues = React.useMemo(() => {
    const list = issues || EMPTY_ISSUES;
    return list.filter(
      (i) => !q || i.summary.toLowerCase().includes(q.toLowerCase()),
    );
  }, [issues, q]);

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
