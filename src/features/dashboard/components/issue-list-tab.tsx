import React, { useState } from "react";
import { Issue, IssueType } from "@/types/issue.types";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/data-display/table";
import {
  IssueRow,
  TypeIcon,
} from "@/features/dashboard/components/issue-table-row";

interface IssueListTabProps {
  title: string;
  subtitle: string;
  issues: Issue[];
  isLoading?: boolean;
  onIssueClick?: (issueId: string) => void;
}

export function IssueListTab({
  title,
  subtitle,
  issues,
  isLoading,
  onIssueClick,
}: IssueListTabProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = React.useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto px-6 py-6 bg-muted/50 flex items-center justify-center">
        <span className="text-muted-foreground">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 bg-muted/50">
      <div className="w-full">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-bold text-foreground tracking-tight">
              {title}
            </h2>
            <p className="text-[13px] text-muted-foreground mt-1">{subtitle}</p>
          </div>
        </div>

        {Object.values(IssueType).map((type) => {
          const typeIssues = issues.filter((i) => i.type === type);
          if (typeIssues.length === 0) return null;

          return (
            <div key={type} className="mb-8 last:mb-0">
              <h3 className="text-[14px] font-bold text-foreground capitalize mb-3 flex items-center gap-2">
                <TypeIcon type={type as Issue["type"]} className="w-4 h-4" />
                {type}s{" "}
                <span className="text-muted-foreground font-medium text-[12px] ml-1">
                  ({typeIssues.length})
                </span>
              </h3>

              <div className="bg-card rounded-lg border border-border/60 shadow-sm overflow-hidden flex flex-col w-full">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[130px] px-4">Key</TableHead>
                      <TableHead>Summary</TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead className="w-[90px]">Sub-issues</TableHead>
                      <TableHead className="w-[110px]">Priority</TableHead>
                      <TableHead className="w-[70px] text-right pr-4">
                        Assignee
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {typeIssues.map((issue) => (
                      <IssueRow
                        key={issue.id}
                        issue={issue}
                        expanded={expanded}
                        toggleExpand={toggleExpand}
                        onIssueClick={onIssueClick}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
