import React from "react";
import { Issue } from "@/types/issue.types";
import { IssueListTab } from "@/features/issues/components/issue-list-tab";

interface DashboardIssuesTabProps {
  q: string;
  issues?: Issue[];
  isLoading?: boolean;
  onIssueClick?: (
    issueId: string,
    issueData?: { issueKey?: string; type?: string },
  ) => void;
}

const EMPTY_ISSUES: Issue[] = [];

export function DashboardIssuesTab({
  issues = EMPTY_ISSUES,
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
