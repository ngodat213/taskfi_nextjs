import Image from "next/image";
import { getInitials } from "@/utils/string";
import { Tooltip } from "@/components/ui/feedback/tooltip";
import { CaretDownIcon, CaretRightIcon, CheckSquareIcon } from "@phosphor-icons/react/dist/ssr";
import React from "react";
import { Issue } from "@/types/issue.types";
import { cn } from "@/utils/cn";
import { TableRow, TableCell } from "@/components/ui/data-display/table";
import {
  ISSUE_TYPE_CONFIG,
  PRIORITY_CONFIG,
  STATUS_VARIANT_MAP,
} from "@/features/dashboard/constants/issue-ui.constants";
import { Badge } from "@/components/ui/data-display/badge";

export const TypeIcon = ({
  type,
  className,
}: {
  type: Issue["type"];
  className?: string;
}) => {
  const normalizedKey = (type || "").toLowerCase().trim();
  const config =
    ISSUE_TYPE_CONFIG[type] ||
    ISSUE_TYPE_CONFIG[normalizedKey] ||
    ISSUE_TYPE_CONFIG.task;

  const Icon = config ? config.icon : CheckSquareIcon;
  const colorClass = config
    ? config.colorClass
    : "text-blue-600 dark:text-blue-400";

  return <Icon className={cn(colorClass, className)} />;
};

export const PriorityIcon = ({
  priority,
  className,
}: {
  priority: Issue["priority"];
  className?: string;
}) => {
  const config = PRIORITY_CONFIG[priority];
  if (!config) return null;
  const Icon = config.icon;
  return <Icon className={cn(config.colorClass, className)} />;
};

export const StatusBadge = ({
  status,
  className,
}: {
  status: string;
  className?: string;
}) => {
  const normalizedKey = (status || "").toLowerCase().trim();
  const variant =
    STATUS_VARIANT_MAP[normalizedKey] || STATUS_VARIANT_MAP[status] || "slate";

  return (
    <Badge
      variant={variant}
      className={cn(
        "font-bold px-2 py-0.5 rounded-sm text-[10px] uppercase tracking-wider",
        className,
      )}
    >
      {status || "To Do"}
    </Badge>
  );
};

export interface IssueRowProps {
  issue: Issue;
  depth?: number;
  isLastChildArray?: boolean[];
  expanded: Record<string, boolean>;
  toggleExpand: (id: string, e: React.MouseEvent) => void;
  onIssueClick?: (issueId: string) => void;
}

export const IssueRow = ({
  issue,
  depth = 0,
  isLastChildArray = [],
  expanded,
  toggleExpand,
  onIssueClick,
}: IssueRowProps) => {
  const hasChildren = issue.children && issue.children.length > 0;
  const isExpanded = expanded[issue.id];

  const assigneeAvatarUrl = issue.assignee?.avatarUrl;
  const assigneeName = issue.assignee?.name;
  const assigneeDisplay = assigneeName
    ? getInitials(assigneeName)
    : issue.assigneeId
      ? issue.assigneeId.substring(0, 2).toUpperCase()
      : "UN";

  return (
    <React.Fragment>
      <TableRow
        className={cn(
          "group cursor-pointer relative",
          depth > 0 ? "bg-muted/40 hover:bg-secondary/50" : "hover:bg-muted/50",
        )}
        onClick={(e) => {
          if (onIssueClick && !hasChildren) {
            onIssueClick(issue.id);
          } else if (hasChildren) {
            toggleExpand(issue.id, e);
          }
        }}
      >
        <TableCell className="align-middle px-4 relative overflow-hidden">
          {/* Tree Lines */}
          {depth > 0 && (
            <>
              {Array.from({ length: depth - 1 }).map(
                (_, i) =>
                  !isLastChildArray[i] && (
                    <div
                      key={i}
                      className="absolute top-0 bottom-0 w-px bg-border pointer-events-none"
                      style={{ left: `${26 + i * 28}px` }}
                    />
                  ),
              )}
              <div
                className="absolute top-0 w-px bg-border pointer-events-none"
                style={{
                  left: `${26 + (depth - 1) * 28}px`,
                  height: isLastChildArray[depth - 1] ? "50%" : "100%",
                }}
              />
              <div
                className="absolute bg-border pointer-events-none"
                style={{
                  left: `${26 + (depth - 1) * 28}px`,
                  top: "50%",
                  width: "18px",
                  height: "1px",
                }}
              />
            </>
          )}

          <div
            className="flex items-center gap-1.5 relative z-10"
            style={{ paddingLeft: `${depth * 28}px` }}
          >
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              {hasChildren ? (
                <button
                  className="w-full h-full flex items-center justify-center rounded-sm hover:bg-secondary text-muted-foreground transition-colors bg-card border border-border shadow-sm z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(issue.id, e);
                  }}
                >
                  {isExpanded ? (
                    <CaretDownIcon className="w-3.5 h-3.5" />
                  ) : (
                    <CaretRightIcon className="w-3.5 h-3.5" />
                  )}
                </button>
              ) : null}
            </div>

            <TypeIcon type={issue.type} className="w-3.5 h-3.5 mr-0.5" />

            <span className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider group-hover:text-foreground transition-colors">
              {issue.issueKey || issue.id}
            </span>
          </div>
        </TableCell>
        <TableCell className="align-middle group-hover:border-blue-500 transition-colors">
          <span
            className={cn(
              "text-[13.5px] font-medium tracking-tight transition-colors line-clamp-1",
              issue.status?.toLowerCase() === "done" || issue.status === "Done"
                ? "text-muted-foreground line-through"
                : "text-foreground group-hover:text-blue-700 dark:group-hover:text-blue-400",
            )}
          >
            {issue.summary}
          </span>
        </TableCell>
        <TableCell>
          <StatusBadge status={issue.status} />
        </TableCell>
        <TableCell>
          {hasChildren ? (
            <div className="bg-secondary/80 text-muted-foreground rounded-sm inline-flex items-center justify-center text-[11px] px-1.5 py-0.5 font-bold">
              {issue.children?.length}
            </div>
          ) : (
            <span className="text-muted-foreground ml-2">-</span>
          )}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-1.5">
            <PriorityIcon priority={issue.priority} className="w-4 h-4" />
            <span className="text-muted-foreground font-medium text-[12.5px]">
              {issue.priority}
            </span>
          </div>
        </TableCell>
        <TableCell className="text-right pr-4">
          <Tooltip
            content={
              assigneeName ||
              (issue.assigneeId
                ? `Assignee: ${issue.assigneeId}`
                : "Unassigned")
            }
          >
            <div className="relative w-6.5 h-6.5 rounded-full bg-secondary border border-border inline-flex items-center justify-center text-[10px] font-bold text-muted-foreground shadow-sm overflow-hidden shrink-0">
              {assigneeAvatarUrl ? (
                <Image
                  src={assigneeAvatarUrl}
                  alt={assigneeName || "Assignee"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                assigneeDisplay
              )}
            </div>
          </Tooltip>
        </TableCell>
      </TableRow>

      {/* Render Children if expanded */}
      {isExpanded &&
        hasChildren &&
        issue.children?.map((child, index) => (
          <IssueRow
            key={child.id}
            issue={child}
            depth={depth + 1}
            isLastChildArray={[
              ...isLastChildArray,
              index === issue.children!.length - 1,
            ]}
            expanded={expanded}
            toggleExpand={toggleExpand}
          />
        ))}
    </React.Fragment>
  );
};
