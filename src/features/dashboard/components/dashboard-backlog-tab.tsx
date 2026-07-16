import React from "react";
import { Issue } from "@/types/issue.types";
import { IssueListTab } from "@/features/dashboard/components/issue-list-tab";

interface DashboardBacklogTabProps {
  q?: string;
  issues?: Issue[];
  isLoading?: boolean;
}

export function DashboardBacklogTab({
  q,
  issues = [],
  isLoading,
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
    />
  );
}
