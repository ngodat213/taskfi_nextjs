"use client";

import * as React from "react";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/utils/cn";

export interface KanbanColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  color?: string;
  count?: number;
  badge?: React.ReactNode;
  onAddClick?: () => void;
  addTooltip?: string;
  children?: React.ReactNode;
  emptyState?: React.ReactNode;
  isEmpty?: boolean;
}

export const KanbanColumn = React.forwardRef<HTMLDivElement, KanbanColumnProps>(
  (
    {
      className,
      title,
      color = "#3b82f6",
      count,
      badge,
      onAddClick,
      addTooltip = "Add item",
      children,
      emptyState,
      isEmpty = false,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col rounded-xl flex-1", className)}
        {...props}
      >
        {/* Column Header */}
        <div className="px-1 py-2 text-[13.5px] font-semibold text-foreground flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="truncate">{title}</span>
            {count !== undefined && (
              <span className="text-muted-foreground text-[13px] font-medium ml-1 shrink-0">
                {count}
              </span>
            )}
            {badge}
          </div>

          {onAddClick && (
            <button
              onClick={onAddClick}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0 ml-1"
              title={addTooltip}
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Column Cards Container */}
        <div className="flex-1 flex flex-col gap-3 pt-1.5 pb-4 px-0.5 min-h-37.5">
          {isEmpty && emptyState ? emptyState : children}
        </div>
      </div>
    );
  },
);

KanbanColumn.displayName = "KanbanColumn";
