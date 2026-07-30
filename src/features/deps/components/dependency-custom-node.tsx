"use client";

import { Handle, Position, NodeProps } from "@xyflow/react";
import { TaskCard } from "@/features/board/components/task-card";
import { Issue } from "@/types/issue.types";
import { Avatar } from "@/components/ui/data-display/avatar";
import { Badge } from "@/components/ui/data-display/badge";
import { ItemCard } from "@/components/ui/data-display/item-card";
import { cn } from "@/utils/cn";

export interface DependencyNodeData {
  issue?: Issue;
  key: string;
  title: string;
  assignee: string;
  avatar?: string;
  status: "Done" | "In Progress" | "Todo" | string;
  risk?: "critical" | "warning" | "resolved";
  isHighlighted?: boolean;
  isDimmed?: boolean;
  onIssueClick?: (
    issueId: string,
    issueData?: { issueKey?: string; type?: string },
  ) => void;
}

function getHighlightedBorderClass(
  isHighlighted?: boolean,
  isSubtask?: boolean,
) {
  if (!isHighlighted) return undefined;
  return isSubtask
    ? "border-emerald-500! dark:border-emerald-400! scale-[1.02] z-50"
    : "border-slate-400! dark:border-white! scale-[1.02] z-50";
}

const RISK_COLORS: Record<string, string> = {
  critical: "bg-rose-500",
  warning: "bg-amber-500",
  resolved: "bg-emerald-500",
};

export function DependencyCustomNode({ data }: NodeProps) {
  const nodeData = data as unknown as DependencyNodeData;
  const isSubtask = !!nodeData.issue?.parentId;
  const riskColor =
    RISK_COLORS[nodeData.risk || "resolved"] || "bg-emerald-500";
  const highlightedBorderClass = getHighlightedBorderClass(
    nodeData.isHighlighted,
    isSubtask,
  );

  const hoverBorderClass = isSubtask
    ? "hover:border-emerald-500 dark:hover:border-emerald-400"
    : "hover:border-slate-400 dark:hover:border-white";

  return (
    <div
      className={cn(
        "w-64 relative transition-all duration-200 group cursor-grab active:cursor-grabbing",
        nodeData.isDimmed ? "opacity-30 grayscale-40" : "",
      )}
    >
      {nodeData.issue ? (
        <TaskCard
          issue={nodeData.issue}
          onIssueClick={nodeData.onIssueClick}
          className={cn(hoverBorderClass, highlightedBorderClass)}
        />
      ) : (
        <ItemCard
          onClick={() =>
            nodeData.onIssueClick &&
            nodeData.issue?.id &&
            nodeData.onIssueClick(nodeData.issue.id, nodeData.issue)
          }
          className={cn(
            "w-full relative bg-card/95 backdrop-blur-md rounded-xl p-3.5 border border-border/80 transition-all duration-200",
            hoverBorderClass,
            highlightedBorderClass,
          )}
          itemKey={
            <span className="px-1.5 py-0.5 rounded text-[10.5px] font-semibold bg-secondary text-foreground border border-border/80">
              {nodeData.key}
            </span>
          }
          action={
            <span className={cn("w-2.5 h-2.5 rounded-full", riskColor)} />
          }
          title={nodeData.title}
          footerLeft={
            <div className="flex items-center gap-1.5 truncate">
              <Avatar
                src={nodeData.avatar}
                alt={nodeData.assignee}
                size="sm"
                className="w-4 h-4"
              />
              <span className="truncate">{nodeData.assignee}</span>
            </div>
          }
          footerRight={<Badge variant="slate">{nodeData.status}</Badge>}
        />
      )}

      {/* Target Handles (Incoming Connections) */}
      <Handle
        type="target"
        position={Position.Left}
        id="target-left"
        className="w-2.5 h-2.5 bg-blue-500! border-2! border-background! opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <Handle
        type="target"
        position={Position.Right}
        id="target-right"
        className="w-2.5 h-2.5 bg-blue-500! border-2! border-background! opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="target-top"
        className="w-2.5 h-2.5 bg-blue-500! border-2! border-background! opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="target-bottom"
        className="w-2.5 h-2.5 bg-blue-500! border-2! border-background! opacity-0 group-hover:opacity-100 transition-opacity"
      />

      {/* Source Handles (Outgoing Connections) */}
      <Handle
        type="source"
        position={Position.Left}
        id="source-left"
        className="w-2.5 h-2.5 bg-blue-500! border-2! border-background! opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="source-right"
        className="w-2.5 h-2.5 bg-blue-500! border-2! border-background! opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <Handle
        type="source"
        position={Position.Top}
        id="source-top"
        className="w-2.5 h-2.5 bg-blue-500! border-2! border-background! opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="source-bottom"
        className="w-2.5 h-2.5 bg-blue-500! border-2! border-background! opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </div>
  );
}
