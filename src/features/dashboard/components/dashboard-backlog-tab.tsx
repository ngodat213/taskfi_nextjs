import React from "react";

import { IssueListTab } from "@/features/dashboard/components/issue-list-tab";
import { Issue } from "@/types/issue.types";

interface DashboardBacklogTabProps {
  q?: string;
  issues?: Issue[];
  isLoading?: boolean;
  onIssueClick?: (issueId: string) => void;
}

export function DashboardBacklogTab({
  q,
  issues = [],
  isLoading,
  onIssueClick,
}: DashboardBacklogTabProps) {
  const filteredIssues = React.useMemo(() => {
    return issues.filter(
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
