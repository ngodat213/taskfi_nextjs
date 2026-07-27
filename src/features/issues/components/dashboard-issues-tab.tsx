import React from "react";
import { Issue } from "@/types/issue.types";
import { IssueListTab } from "@/features/issues/components/issue-list-tab";

interface DashboardIssuesTabProps {
  q: string;
  issues?: Issue[];
  isLoading?: boolean;
  onIssueClick?: (issueId: string) => void;
}

const EMPTY_ISSUES: Issue[] = [];

export function DashboardIssuesTab({
  q,
  issues = EMPTY_ISSUES,
  isLoading,
  onIssueClick,
}: DashboardIssuesTabProps) {
  const filteredIssues = React.useMemo(() => {
    const list = issues || EMPTY_ISSUES;
    return list
      .filter((i) => i.type?.toLowerCase() === "bug")
      .filter((i) => !q || i.summary.toLowerCase().includes(q.toLowerCase()));
  }, [issues, q]);

  return (
    <IssueListTab
      title="Issue Tracker"
      subtitle={`${filteredIssues.length} active bugs`}
      issues={filteredIssues}
      isLoading={isLoading}
      onIssueClick={onIssueClick}
    />
  );
}
