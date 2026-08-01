import React, { useState } from "react";

import { CheckSquareIcon } from "@phosphor-icons/react/dist/ssr";
import { type Variants, motion } from "framer-motion";

import { EmptyState } from "@/components/ui/data-display/empty-state";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/data-display/table";
import {
  SPRING_CARD_VARIANTS,
  STAGGER_CONTAINER_VARIANTS,
} from "@/constants/animations";
import {
  IssueRow,
  TypeIcon,
} from "@/features/issues/components/issue-table-row";
import { useWorkspaceConfig } from "@/features/workspaces/hooks/use-workspaces";
import { useWorkspaceStore } from "@/store/workspace.store";
import { Issue, IssueType } from "@/types/issue.types";

const containerVariants: Variants = STAGGER_CONTAINER_VARIANTS;
const itemVariants: Variants = SPRING_CARD_VARIANTS;

interface IssueListTabProps {
  title: string;
  subtitle: string;
  issues: Issue[];
  isLoading?: boolean;
  onIssueClick?: (
    issueId: string,
    issueData?: { issueKey?: string; type?: string },
  ) => void;
}

export function IssueListTab({
  title,
  subtitle,
  issues,
  isLoading,
  onIssueClick,
}: IssueListTabProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId,
  );
  const { data: configResponse } = useWorkspaceConfig(
    activeWorkspaceId as string,
  );

  const toggleExpand = React.useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const issueTypeNames = React.useMemo(() => {
    if (
      configResponse?.data?.issueTypes &&
      configResponse.data.issueTypes.length > 0
    ) {
      return configResponse.data.issueTypes.map((t) => t.name);
    }
    return Object.values(IssueType);
  }, [configResponse]);

  const groupedIssues = React.useMemo(() => {
    const map: Record<string, Issue[]> = {};
    issueTypeNames.forEach((type) => {
      map[type] = issues.filter(
        (i) => (i.type || "").toLowerCase() === type.toLowerCase(),
      );
    });
    return map;
  }, [issues, issueTypeNames]);

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto px-6 py-6 bg-transparent flex items-center justify-center">
        <span className="text-muted-foreground">Loading...</span>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex-1 overflow-y-auto px-6 py-6 bg-transparent"
    >
      <div className="w-full">
        <motion.div
          variants={itemVariants}
          className="mb-6 flex items-center justify-between"
        >
          <div>
            <h2 className="text-[18px] font-bold text-foreground tracking-tight">
              {title}
            </h2>
            <p className="text-[13px] text-muted-foreground mt-1">{subtitle}</p>
          </div>
        </motion.div>

        {issues.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="bg-card border border-border/60 rounded-xl p-6 shadow-sm"
          >
            <EmptyState
              icon={CheckSquareIcon}
              title="No issues found"
              description="There are currently no tasks or issues created in this view."
            />
          </motion.div>
        ) : (
          issueTypeNames.map((type) => {
            const typeIssues = groupedIssues[type] || [];
            if (typeIssues.length === 0) return null;

            return (
              <motion.div
                key={type}
                variants={itemVariants}
                className="mb-8 last:mb-0"
              >
                <h3 className="text-[14px] font-bold text-foreground capitalize mb-3 flex items-center gap-2">
                  <TypeIcon type={type} className="w-4 h-4" />
                  {type}{" "}
                  <span className="text-muted-foreground font-medium text-[12px] ml-1">
                    ({typeIssues.length})
                  </span>
                </h3>

                <div className="bg-card rounded-lg border border-border/60 shadow-sm overflow-hidden flex flex-col w-full">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-32.5 px-4">Key</TableHead>
                        <TableHead>Summary</TableHead>
                        <TableHead className="w-30">Status</TableHead>
                        <TableHead className="w-22.5">Sub-issues</TableHead>
                        <TableHead className="w-27.5">Priority</TableHead>
                        <TableHead className="w-17.5 text-right pr-4">
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
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
