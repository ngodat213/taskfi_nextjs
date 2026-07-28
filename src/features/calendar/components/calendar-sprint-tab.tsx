"use client";

import { RocketIcon, FlameIcon, PaintBrushIcon, ClockIcon, CalendarBlankIcon, FlagIcon } from "@phosphor-icons/react/dist/ssr";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const SPRINT_COLUMNS = [
  {
    id: "completed",
    title: "Completed",
    count: 1,
    dotColor: "bg-emerald-500",
    badgeStyle:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    items: [
      {
        id: "del-1",
        title: "TaskFi v1.4 Main Release",
        description:
          "Production release for Next.js Frontend and NestJS Backend cluster.",
        targetDate: "July 22, 2026",
        icon: RocketIcon,
        iconColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        owner: "Dat Ngo",
        ownerInitials: "DN",
        progress: 100,
      },
    ],
  },
  {
    id: "in_progress",
    title: "In Progress",
    count: 1,
    dotColor: "bg-amber-500 animate-pulse",
    badgeStyle:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    items: [
      {
        id: "del-2",
        title: "NestJS Socket Cluster Rollout",
        description:
          "High-performance WebSocket gateway for real-time task notifications.",
        targetDate: "July 24, 2026",
        icon: FlameIcon,
        iconColor: "text-orange-500 bg-orange-500/10 border-orange-500/20",
        owner: "Alex Rivers",
        ownerInitials: "AR",
        progress: 65,
      },
    ],
  },
  {
    id: "upcoming",
    title: "Upcoming",
    count: 1,
    dotColor: "bg-purple-500",
    badgeStyle:
      "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    items: [
      {
        id: "del-3",
        title: "Design System Tokens Lock",
        description:
          "Standardizing color tokens and HSL custom property variables.",
        targetDate: "July 25, 2026",
        icon: PaintBrushIcon,
        iconColor: "text-purple-500 bg-purple-500/10 border-purple-500/20",
        owner: "Sam Lee",
        ownerInitials: "SL",
        progress: 20,
      },
    ],
  },
];

export function CalendarSprintTab() {
  return (
    <div className="flex-1 overflow-y-auto flex flex-col gap-6 py-1">
      {/* Sleek Top Sprint Ribbon (No Heavy Box Wrapper) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-lg text-[12px] font-extrabold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1.5 shadow-2xs">
            <FlagIcon className="w-3.5 h-3.5" />
            <span>Sprint 14 Active</span>
          </span>
          <span className="text-[12.5px] text-muted-foreground font-medium flex items-center gap-1.5">
            <CalendarBlankIcon className="w-3.5 h-3.5" />
            <span>July 20 - July 26, 2026</span>
          </span>
        </div>

        {/* Progress Metric */}
        <div className="flex items-center gap-3 bg-secondary border border-border/50 px-3.5 py-1.5 rounded-xl shrink-0">
          <span className="text-[12px] font-semibold text-muted-foreground">
            Sprint Completion:
          </span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden border border-border/40">
              <div className="h-full bg-emerald-500 rounded-full w-[75%]" />
            </div>
            <span className="text-[12px] font-extrabold text-foreground">
              75%
            </span>
          </div>
        </div>
      </div>

      {/* 3 Status Columns Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
        {SPRINT_COLUMNS.map((col) => (
          <div key={col.id} className="flex flex-col gap-3">
            {/* Column Header */}
            <div className="flex items-center justify-between px-1 py-0.5">
              <div className="flex items-center gap-2">
                <span className={cn("w-2 h-2 rounded-full", col.dotColor)} />
                <h4 className="text-[13.5px] font-bold text-foreground tracking-tight">
                  {col.title}
                </h4>
              </div>
              <span
                className={cn(
                  "px-2 py-0.2 rounded-md text-[11px] font-bold border",
                  col.badgeStyle,
                )}
              >
                {col.count}
              </span>
            </div>

            {/* Column Cards */}
            <div className="flex flex-col gap-3">
              {col.items.map((item) => {
                const IconComp = item.icon;

                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -3, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="bg-card border border-border/80 hover:border-primary/50 rounded-2xl p-4.5 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col gap-3 group select-none"
                  >
                    {/* Header */}
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border mt-0.5",
                          item.iconColor,
                        )}
                      >
                        <IconComp className="w-4.5 h-4.5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <h5 className="text-[14px] font-bold text-foreground group-hover:text-primary transition-colors tracking-tight line-clamp-1">
                          {item.title}
                        </h5>
                        <p className="text-[12px] text-muted-foreground mt-0.5 line-clamp-2 leading-snug">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="flex flex-col gap-1 pt-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground font-medium">
                          Deliverable Progress
                        </span>
                        <span className="font-bold text-foreground">
                          {item.progress}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden border border-border/30">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            col.id === "completed"
                              ? "bg-emerald-500"
                              : col.id === "in_progress"
                                ? "bg-amber-500"
                                : "bg-purple-500",
                          )}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11.5px] text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <ClockIcon className="w-3.5 h-3.5" />
                        <span>{item.targetDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-secondary text-[10px] font-bold flex items-center justify-center text-foreground border border-border/50">
                          {item.ownerInitials}
                        </div>
                        <span className="font-medium text-foreground">
                          {item.owner}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
