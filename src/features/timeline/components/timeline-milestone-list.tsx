"use client";

import { MilestoneItem } from "@/features/timeline/types/timeline.types";
import { CalendarBlankIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/utils/cn";

interface TimelineMilestoneListProps {
  milestones: MilestoneItem[];
}

export function TimelineMilestoneList({
  milestones,
}: TimelineMilestoneListProps) {
  return (
    <div className="flex flex-col gap-3 max-w-5xl">
      <div className="flex items-center justify-between">
        <h4 className="text-[13.5px] font-bold text-foreground tracking-tight flex items-center gap-2">
          <span>Major Project Release Milestones</span>
        </h4>
        <span className="text-[11.5px] font-medium text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-full border border-border/60">
          Showing {milestones.length} Milestones
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {milestones.map((ms) => {
          const completionPct = Math.round(
            (ms.completedTasks / ms.totalTasks) * 100,
          );

          return (
            <div
              key={ms.id}
              className="bg-card border border-border/80 rounded-2xl p-3.5 shadow-2xs flex flex-col justify-between gap-3 group hover:border-primary/50 transition-all duration-200"
            >
              {/* Header: Title & Status */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      "text-[10.5px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider",
                      ms.status === "on_track"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        : ms.status === "at_risk"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                          : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
                    )}
                  >
                    {ms.status.replace("_", " ")}
                  </span>

                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                    <CalendarBlankIcon className="w-3.5 h-3.5 text-blue-500" />
                    <span>{ms.dueDate}</span>
                  </div>
                </div>

                <h5 className="text-[13.5px] font-bold text-foreground leading-snug line-clamp-2">
                  {ms.title}
                </h5>
                <p className="text-[11.5px] text-muted-foreground line-clamp-2">
                  {ms.keyDeliverable}
                </p>
              </div>

              {/* Progress & Owner Row */}
              <div className="flex flex-col gap-2 pt-2 border-t border-border/60">
                <div className="flex items-center justify-between text-[11.5px]">
                  <span className="text-muted-foreground font-medium">
                    Tasks: {ms.completedTasks} / {ms.totalTasks}
                  </span>
                  <span className="font-bold text-foreground">
                    {completionPct}%
                  </span>
                </div>

                <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden border border-border/40">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      ms.status === "at_risk"
                        ? "bg-amber-500"
                        : "bg-linear-to-r from-blue-500 to-emerald-500",
                    )}
                    style={{ width: `${completionPct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                  <div className="flex items-center gap-1.5">
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white",
                        ms.owner.avatarBg || "bg-blue-500",
                      )}
                    >
                      {ms.owner.name.charAt(0)}
                    </div>
                    <span>{ms.owner.name}</span>
                  </div>

                  <span className="font-semibold text-foreground bg-secondary px-2 py-0.5 rounded">
                    Lead Owner
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
