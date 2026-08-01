import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";

import { Issue } from "@/types/issue.types";

import { SortableTaskCard } from "./sortable-task-card";

interface BoardColumnProps {
  col: {
    id: string;
    title: string;
    color: string;
    count: number;
    issues: Issue[];
  };
  isMobile: boolean;
  q: string;
  onIssueClick?: (
    issueId: string,
    issueData?: { issueKey?: string; type?: string },
  ) => void;
  onAddClick?: (status: string) => void;
}

export function BoardColumn({
  col,
  isMobile,
  q,
  onIssueClick,
  onAddClick,
}: BoardColumnProps) {
  const { setNodeRef } = useDroppable({
    id: col.id,
  });

  return (
    <div
      className={
        isMobile
          ? "w-full flex flex-col rounded-xl"
          : "flex-1 min-w-75 max-w-85 flex flex-col h-full rounded-xl"
      }
    >
      <div className="px-1 py-2 text-[13.5px] font-semibold text-foreground flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: col.color || "#94a3b8" }}
          />
          {col.title}
          <span className="text-muted-foreground text-[13px] font-medium ml-1">
            {col.count}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-border/80 text-muted-foreground text-[10px] uppercase font-bold tracking-wider ml-1">
            WIP ∞
          </span>
        </div>
        <button
          onClick={() => onAddClick?.(col.title)}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-secondary/50 text-muted-foreground transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={
          isMobile
            ? "flex flex-row gap-3 overflow-x-auto pb-4 snap-x hide-scrollbar scrollbar-none [&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar]:w-0 pt-1 px-0.5"
            : "flex-1 overflow-y-auto hide-scrollbar scrollbar-none [&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar]:w-0 flex flex-col gap-3 pt-1.5 pb-4 px-0.5 min-h-37.5"
        }
      >
        <SortableContext
          items={col.issues.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {col.issues
            .filter(
              (i) => !q || i.summary.toLowerCase().includes(q.toLowerCase()),
            )
            .map((issue) => (
              <SortableTaskCard
                key={issue.id}
                issue={issue}
                isMobile={isMobile}
                onIssueClick={onIssueClick}
              />
            ))}
        </SortableContext>

        {col.issues.filter(
          (i) => !q || i.summary.toLowerCase().includes(q.toLowerCase()),
        ).length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-border/60 bg-card/30 text-center min-h-36 transition-colors">
            <span className="text-[12.5px] font-medium text-muted-foreground/80 mb-1.5">
              No tasks in {col.title}
            </span>
            <button
              onClick={() => onAddClick?.(col.title)}
              className="text-[12px] font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 transition-colors"
            >
              <PlusIcon className="w-3.5 h-3.5" /> Add task
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
