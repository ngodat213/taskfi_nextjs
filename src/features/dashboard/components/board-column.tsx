import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
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
}

export function BoardColumn({ col, isMobile, q }: BoardColumnProps) {
  const { setNodeRef } = useDroppable({
    id: col.id,
  });

  return (
    <div
      className={
        isMobile
          ? "w-full flex flex-col rounded-xl"
          : "flex-1 min-w-[300px] max-w-[340px] flex flex-col h-full rounded-xl"
      }
    >
      <div className="px-1 py-2 text-[13.5px] font-semibold text-slate-800 flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: col.color || "#94a3b8" }}
          />
          {col.title}
          <span className="text-slate-400 text-[13px] font-medium ml-1">
            {col.count}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-500 text-[10px] uppercase font-bold tracking-wider ml-1">
            WIP ∞
          </span>
        </div>
        <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-200/50 text-slate-400 transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={
          isMobile
            ? "flex flex-row gap-3 overflow-x-auto pb-4 snap-x hide-scrollbar"
            : "flex-1 overflow-y-auto flex flex-col gap-3 pb-4 min-h-[150px]"
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
              />
            ))}
        </SortableContext>
      </div>
    </div>
  );
}
