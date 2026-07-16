import React from "react";
import { Issue } from "@/types/issue.types";
import { IssueListTab } from "@/features/dashboard/components/issue-list-tab";
interface DashboardDoneTabProps {
  q: string;
  issues?: Issue[];
  isLoading?: boolean;
}

export function DashboardDoneTab({
  q,
  issues = [],
  isLoading,
}: DashboardDoneTabProps) {
  const doneIssues = issues.filter((i) => i.status?.toLowerCase() === "done");

  const filteredIssues = doneIssues.filter(
    (i) => !q || i.summary.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <IssueListTab
      title="Done Tracker"
      subtitle={`${filteredIssues.length} completed items`}
      issues={filteredIssues}
      isLoading={isLoading}
    />
  );
}
