import React from "react";

import { IssueListTab } from "@/features/dashboard/components/issue-list-tab";
import { Issue } from "@/types/issue.types";

interface DashboardIssuesTabProps {
  q: string;
  issues?: Issue[];
  isLoading?: boolean;
  onIssueClick?: (issueId: string) => void;
}

export function DashboardIssuesTab({
  issues = [],
  isLoading,
  onIssueClick,
}: DashboardIssuesTabProps) {
  return (
    <IssueListTab
      title="Issue Tracker"
      subtitle={`${issues.length} issues`}
      issues={issues}
      isLoading={isLoading}
      onIssueClick={onIssueClick}
    />
  );
}
