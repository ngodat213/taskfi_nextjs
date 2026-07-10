import React, { useState } from "react";
import { columns, Issue } from "./mock-data";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BugIcon,
  AlertCircle,
  ChevronUp,
  Equal,
  ChevronDown,
  ChevronRight,
  CornerDownRight,
  Zap,
  Bookmark,
  CheckSquare,
} from "lucide-react";
import { cn } from "@/utils/cn";

interface DashboardDoneTabProps {
  q: string;
}

export function DashboardDoneTab({ q }: DashboardDoneTabProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Flatten issues and attach status
  const allIssues = columns.flatMap((col) =>
    col.issues.map((issue) => ({ ...issue, status: col.title })),
  );

  // Filter only done issues (all types)
  const doneIssues = allIssues.filter((i) => i.status === "Done");

  // Apply search query
  const filteredIssues = doneIssues.filter(
    (i) => !q || i.summary.toLowerCase().includes(q.toLowerCase()),
  );

  const renderIssueRow = (
    issue: Issue,
    depth = 0,
    isLastChildArray: boolean[] = [],
  ) => {
    const isExpanded = expanded[issue.id];
    const hasChildren = issue.children && issue.children.length > 0;

    return (
      <React.Fragment key={issue.id}>
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
                {/* Lines for previous levels (vertical lines passing through) */}
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

                {/* Connector for current item */}
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
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                {issue.children && issue.children.length > 0 ? (
                  <button
                    className="w-full h-full flex items-center justify-center rounded-[4px] hover:bg-slate-200 text-slate-500 transition-colors bg-white border border-slate-200 shadow-sm z-10"
                    onClick={(e) => toggleExpand(issue.id, e)}
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </button>
                ) : null}
              </div>

              {/* Type icon to make it clear what type of child it is */}
              {issue.type === "epic" && (
                <Zap className="w-3.5 h-3.5 text-purple-500 fill-purple-500 mr-0.5" />
              )}
              {issue.type === "story" && (
                <Bookmark className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500 mr-0.5" />
              )}
              {issue.type === "task" && (
                <CheckSquare className="w-3.5 h-3.5 text-blue-500 fill-blue-50 mr-0.5" />
              )}
              {issue.type === "bug" && (
                <BugIcon className="w-3.5 h-3.5 text-red-500 mr-0.5" />
              )}
              {issue.type === "subtask" && (
                <CornerDownRight className="w-3.5 h-3.5 text-slate-400 mr-0.5" />
              )}

              <span className="text-[12px] font-medium text-slate-500 uppercase tracking-wider group-hover:text-slate-700 transition-colors">
                {issue.id}
              </span>
            </div>
          </TableCell>
          <TableCell className="align-middle">
            <span className="text-[13.5px] font-medium text-slate-400 line-through tracking-tight transition-colors line-clamp-1">
              {issue.summary}
            </span>
          </TableCell>
          <TableCell>
            <Badge
              variant={
                issue.status === "To Do"
                  ? "slate"
                  : issue.status === "In Progress"
                    ? "blue"
                    : issue.status === "In Review"
                      ? "amber"
                      : "emerald"
              }
              className="font-bold px-2 py-0.5 rounded-[4px] text-[10px] uppercase tracking-wider"
            >
              {issue.status || "To Do"}
            </Badge>
          </TableCell>
          <TableCell>
            {hasChildren ? (
              <Badge
                variant="slate"
                className="bg-slate-100/80 text-slate-600 border-0 text-[11px] px-1.5 font-bold shadow-none"
              >
                {issue.children?.length}
              </Badge>
            ) : (
              <span className="text-slate-300 ml-2">-</span>
            )}
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-1.5">
              {issue.priority === "Critical" && (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
              {issue.priority === "High" && (
                <ChevronUp className="w-4 h-4 text-orange-500" />
              )}
              {issue.priority === "Medium" && (
                <Equal className="w-4 h-4 text-amber-500" />
              )}
              {issue.priority === "Low" && (
                <ChevronDown className="w-4 h-4 text-blue-500" />
              )}
              <span className="text-[12px] font-medium text-slate-600">
                {issue.priority}
              </span>
            </div>
          </TableCell>
          <TableCell className="text-right pr-4">
            <div className="w-[26px] h-[26px] rounded-full bg-slate-100 border border-slate-200 inline-flex items-center justify-center text-[10px] font-bold text-slate-600 shadow-sm">
              {issue.assignee}
            </div>
          </TableCell>
        </TableRow>
        {hasChildren &&
          isExpanded &&
          issue.children?.map((child: Issue, index: number) =>
            renderIssueRow(child, depth + 1, [
              ...isLastChildArray,
              index === (issue.children?.length ?? 0) - 1,
            ]),
          )}
      </React.Fragment>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 bg-slate-50/50">
      <div className="w-full">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">
              Done Tracker
            </h2>
            <p className="text-[13px] text-slate-500 mt-1">
              {filteredIssues.length} completed items
            </p>
          </div>
        </div>

        {["epic", "story", "task", "bug", "subtask"].map((type) => {
          const typeIssues = filteredIssues.filter((i) => i.type === type);
          if (typeIssues.length === 0) return null;

          return (
            <div key={type} className="mb-8 last:mb-0">
              <h3 className="text-[14px] font-bold text-slate-800 capitalize mb-3 flex items-center gap-2">
                {type === "epic" && (
                  <Zap className="w-4 h-4 text-purple-500 fill-purple-500" />
                )}
                {type === "story" && (
                  <Bookmark className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                )}
                {type === "task" && (
                  <CheckSquare className="w-4 h-4 text-blue-500 fill-blue-50" />
                )}
                {type === "bug" && <BugIcon className="w-4 h-4 text-red-500" />}
                {type === "subtask" && (
                  <CornerDownRight className="w-4 h-4 text-slate-400" />
                )}
                {type}s{" "}
                <span className="text-slate-400 font-medium text-[12px] ml-1">
                  ({typeIssues.length})
                </span>
              </h3>

              <div className="bg-white rounded-lg border border-slate-200/60 shadow-sm overflow-hidden flex flex-col w-full">
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
                    {typeIssues.map((issue) => renderIssueRow(issue))}
                  </TableBody>
                </Table>
              </div>
            </div>
          );
        })}

        {filteredIssues.length === 0 && (
          <div className="px-5 py-12 text-center text-slate-400 font-medium text-[13px] border-t border-slate-100">
            No completed items found
          </div>
        )}
      </div>
    </div>
  );
}
