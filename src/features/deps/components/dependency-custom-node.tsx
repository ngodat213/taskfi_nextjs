"use client";

import { Handle, Position, NodeProps } from "@xyflow/react";
import { Avatar } from "@/components/ui/data-display/avatar";
import { Badge } from "@/components/ui/data-display/badge";
import { ItemCard } from "@/components/ui/data-display/item-card";

export interface DependencyNodeData {
  key: string;
  title: string;
  assignee: string;
  avatar?: string;
  status: "Done" | "In Progress" | "Todo";
  risk?: "critical" | "warning" | "resolved";
  isHighlighted?: boolean;
  isDimmed?: boolean;
}

export function DependencyCustomNode({ data }: NodeProps) {
  const nodeData = data as unknown as DependencyNodeData;

  const riskColor =
    nodeData.risk === "critical"
      ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"
      : nodeData.risk === "warning"
        ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"
        : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]";

  return (
    <ItemCard
      className={`w-60 relative bg-card/95 backdrop-blur-md border rounded-xl p-3.5 shadow-md transition-all duration-300 group cursor-grab active:cursor-grabbing ${
        nodeData.isHighlighted
          ? "border-primary/90! ring-2 ring-primary/80 shadow-[0_0_24px_rgba(59,130,246,0.6)] scale-103 z-50!"
          : nodeData.isDimmed
            ? "opacity-30 grayscale-40 border-border/40"
            : "border-border/80 hover:border-primary/50"
      }`}
      itemKey={
        <span className="px-1.5 py-0.5 rounded text-[10.5px] font-semibold bg-secondary text-foreground border border-border/80">
          {nodeData.key}
        </span>
      }
      action={<span className={`w-2.5 h-2.5 rounded-full ${riskColor}`} />}
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
      footerRight={
        <Badge
          variant={
            nodeData.status === "Done"
              ? "emerald"
              : nodeData.status === "In Progress"
                ? "blue"
                : "slate"
          }
        >
          {nodeData.status}
        </Badge>
      }
    >
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
    </ItemCard>
  );
}
