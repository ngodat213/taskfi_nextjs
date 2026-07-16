import React from "react";
import { Issue } from "@/types/issue.types";
import { cn } from "@/utils/cn";
import { TableRow, TableCell } from "@/components/ui/data-display/table";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  ISSUE_TYPE_CONFIG,
  PRIORITY_CONFIG,
  STATUS_VARIANT_MAP,
} from "@/features/dashboard/constants/issue-ui.constants";
import { Badge } from "@/components/ui/data-display/badge";
import { IssueStatus } from "@/types/issue.types";

export const TypeIcon = ({
  type,
  className,
}: {
  type: Issue["type"];
  className?: string;
}) => {
  const config = ISSUE_TYPE_CONFIG[type];
  if (!config) return null;
  const Icon = config.icon;
  return <Icon className={cn(config.colorClass, className)} />;
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
  const variant = STATUS_VARIANT_MAP[status] || "slate";

  return (
    <Badge
      variant={variant}
      className={cn(
        "font-bold px-2 py-0.5 rounded-[4px] text-[10px] uppercase tracking-wider",
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
}

export const IssueRow = ({
  issue,
  depth = 0,
  isLastChildArray = [],
  expanded,
  toggleExpand,
}: IssueRowProps) => {
  const hasChildren = issue.children && issue.children.length > 0;
  const isExpanded = expanded[issue.id];

  return (
    <React.Fragment>
      <TableRow
        className={cn(
          "group cursor-pointer relative",
          depth > 0
            ? "bg-slate-50/40 hover:bg-slate-100/50"
            : "hover:bg-slate-50/50",
        )}
        onClick={(e) => hasChildren && toggleExpand(issue.id, e)}
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
                      className="absolute top-0 bottom-0 w-px bg-slate-300 pointer-events-none"
                      style={{ left: `${26 + i * 28}px` }}
                    />
                  ),
              )}
              <div
                className="absolute top-0 w-px bg-slate-300 pointer-events-none"
                style={{
                  left: `${26 + (depth - 1) * 28}px`,
                  height: isLastChildArray[depth - 1] ? "50%" : "100%",
                }}
              />
              <div
                className="absolute bg-slate-300 pointer-events-none"
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
                  className="w-full h-full flex items-center justify-center rounded-[4px] hover:bg-slate-200 text-slate-500 transition-colors bg-white border border-slate-200 shadow-sm z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(issue.id, e);
                  }}
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5" />
                  )}
                </button>
              ) : null}
            </div>

            <TypeIcon type={issue.type} className="w-3.5 h-3.5 mr-0.5" />

            <span className="text-[12px] font-medium text-slate-500 uppercase tracking-wider group-hover:text-slate-700 transition-colors">
              {issue.issueKey || issue.id}
            </span>
          </div>
        </TableCell>
        <TableCell className="align-middle group-hover:border-blue-500 transition-colors">
          <span
            className={cn(
              "text-[13.5px] font-medium tracking-tight transition-colors line-clamp-1",
              issue.status === IssueStatus.DONE
                ? "text-slate-400 line-through"
                : "text-slate-900 group-hover:text-blue-700",
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
            <div className="bg-slate-100/80 text-slate-600 rounded-[4px] inline-flex items-center justify-center text-[11px] px-1.5 py-0.5 font-bold">
              {issue.children?.length}
            </div>
          ) : (
            <span className="text-slate-300 ml-2">-</span>
          )}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-1.5">
            <PriorityIcon priority={issue.priority} className="w-4 h-4" />
            <span className="text-slate-600 font-medium text-[12.5px]">
              {issue.priority}
            </span>
          </div>
        </TableCell>
        <TableCell className="text-right pr-4">
          <div className="w-[26px] h-[26px] rounded-full bg-slate-100 border border-slate-200 inline-flex items-center justify-center text-[10px] font-bold text-slate-600 shadow-sm">
            {issue.assigneeId
              ? issue.assigneeId.substring(0, 2).toUpperCase()
              : "UN"}
          </div>
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
