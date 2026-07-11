import { Plus } from "lucide-react";
import { cn } from "@/utils/cn";
import { columns } from "./mock-data";
import { TaskCard } from "./task-card";

interface DashboardBoardTabProps {
  q: string;
}

export function DashboardBoardTab({ q }: DashboardBoardTabProps) {
  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden px-6 py-4">
      <div className="flex gap-4 h-full min-w-full w-max">
        {columns.map((col) => (
          <div
            key={col.id}
            className="flex-1 min-w-[300px] max-w-[340px] flex flex-col h-full rounded-xl"
          >
            <div className="px-1 py-2 text-[13.5px] font-semibold text-slate-800 flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-2.5 h-2.5 rounded-full",
                    col.id === "todo" && "bg-slate-300",
                    col.id === "in-progress" && "bg-blue-500",
                    col.id === "in-review" && "bg-amber-500",
                    col.id === "done" && "bg-emerald-500",
                  )}
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

            <div className="flex-1 overflow-y-auto flex flex-col gap-3 pb-4">
              {col.issues
                .filter(
                  (i) =>
                    !q || i.summary.toLowerCase().includes(q.toLowerCase()),
                ) // 👱‍♀️ simple inline filter
                .map((issue) => (
                  <TaskCard key={issue.id} issue={issue} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
