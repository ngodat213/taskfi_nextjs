import React from "react";
import { Issue } from "@/types/issue.types";
import { IssueListTab } from "@/features/dashboard/components/issue-list-tab";

interface DashboardIssuesTabProps {
  q: string;
  issues?: Issue[];
  isLoading?: boolean;
}

export function DashboardIssuesTab({
  q,
  issues = [],
  isLoading,
}: DashboardIssuesTabProps) {
  // Filter only bugs
  const bugIssues = issues.filter((i) => i.type?.toLowerCase() === "bug");

  // Apply search query
  const filteredIssues = bugIssues.filter(
    (i) => !q || i.summary.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <IssueListTab
      title="Issue Tracker"
      subtitle={`${filteredIssues.length} active bugs`}
      issues={filteredIssues}
      isLoading={isLoading}
    />
  );
}
