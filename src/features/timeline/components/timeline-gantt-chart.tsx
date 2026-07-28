"use client";

import { useMemo, useState } from "react";
import { TimelineItem } from "@/features/timeline/types/timeline.types";
import { MagnifyingGlassIcon, CheckCircleIcon, ClockIcon, WarningCircleIcon, CaretRightIcon, CaretDownIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/utils/cn";

interface TimelineGanttChartProps {
  items: TimelineItem[];
}

export function TimelineGanttChart({ items }: TimelineGanttChartProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    "tl-1": true,
    "tl-2": true,
  });

  // Calculate overall timeline date bounds (Jul 01, 2026 - Aug 31, 2026)
  const timelineDays = useMemo(() => {
    const days: {
      dateStr: string;
      dayNum: number;
      monthName: string;
      isToday: boolean;
      isWeekend: boolean;
    }[] = [];
    const startDate = new Date(2026, 6, 1); // July 1, 2026
    const endDate = new Date(2026, 7, 31); // Aug 31, 2026

    const curr = new Date(startDate);
    while (curr <= endDate) {
      const year = curr.getFullYear();
      const month = String(curr.getMonth() + 1).padStart(2, "0");
      const day = String(curr.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;
      const dayNum = curr.getDate();
      const monthName = curr.toLocaleString("default", { month: "short" });
      const dayOfWeek = curr.getDay();

      days.push({
        dateStr,
        dayNum,
        monthName,
        isToday: dateStr === "2026-07-23", // Today reference date
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      });

      curr.setDate(curr.getDate() + 1);
    }
    return days;
  }, []);

  const totalDaysCount = timelineDays.length;

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [items, searchQuery, statusFilter]);

  // Helper to calculate position percentage
  const getItemBarPosition = (startDateStr: string, endDateStr: string) => {
    const startIdx = timelineDays.findIndex((d) => d.dateStr === startDateStr);
    const endIdx = timelineDays.findIndex((d) => d.dateStr === endDateStr);

    const startPos = startIdx >= 0 ? (startIdx / totalDaysCount) * 100 : 0;
    const endPos = endIdx >= 0 ? ((endIdx + 1) / totalDaysCount) * 100 : 100;
    const width = Math.max(endPos - startPos, 2);

    return { left: `${startPos}%`, width: `${width}%` };
  };

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-3.5 shadow-2xs flex flex-col gap-3">
      {/* Header & Filter Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-1">
        <div className="flex items-center gap-2">
          <h4 className="text-[13.5px] font-bold text-foreground tracking-tight flex items-center gap-2">
            <span>Project Roadmap & Epic Schedule</span>
          </h4>
          <span className="text-[11px] font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
            {filteredItems.length} items
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-48">
            <MagnifyingGlassIcon className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search epic code or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-secondary/60 border border-border/60 rounded-lg pl-8 pr-3 py-1 text-[12px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-secondary/60 border border-border/60 rounded-lg px-2.5 py-1 text-[12px] text-foreground focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="planned">Planned</option>
          </select>
        </div>
      </div>

      {/* Gantt Table Container */}
      <div className="w-full overflow-x-auto rounded-xl border border-border/60 bg-background/50">
        <div className="min-w-225 flex flex-col">
          {/* Timeline Header Row */}
          <div className="flex border-b border-border/60 bg-secondary/40 text-[11.5px] font-bold text-muted-foreground">
            {/* Left Header Column */}
            <div className="w-[320px] shrink-0 p-3 border-r border-border/60 flex items-center justify-between">
              <span>EPIC / FEATURE NAME</span>
              <span className="text-[10.5px] font-normal text-muted-foreground uppercase">
                Progress
              </span>
            </div>

            {/* Right Date Timeline Header */}
            <div className="flex-1 relative flex items-center">
              {/* Month Titles */}
              <div className="absolute top-1 left-3 text-[10.5px] text-blue-500 font-bold uppercase tracking-wider">
                July 2026
              </div>
              <div className="absolute top-1 left-[50%] text-[10.5px] text-purple-500 font-bold uppercase tracking-wider">
                August 2026
              </div>

              {/* Days Markers */}
              <div className="w-full flex pt-5 pb-1.5 px-1 justify-between text-[10px] text-muted-foreground font-mono">
                {timelineDays.map((d) => (
                  <div
                    key={d.dateStr}
                    className={cn(
                      "flex flex-col items-center shrink-0 w-6",
                      d.isToday && "text-blue-500 font-bold",
                      d.isWeekend && "text-muted-foreground/40",
                    )}
                  >
                    <span>{d.dayNum}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline Rows */}
          <div className="flex flex-col divide-y divide-border/40 relative">
            {filteredItems.map((item) => {
              const isExpanded = expandedItems[item.id] ?? false;
              const pos = getItemBarPosition(item.startDate, item.endDate);

              return (
                <div
                  key={item.id}
                  className="flex hover:bg-secondary/30 transition-colors group relative"
                >
                  {/* Left Metadata Column */}
                  <div className="w-[320px] shrink-0 p-3 border-r border-border/60 flex items-center justify-between gap-2 z-10 bg-background/80 backdrop-blur-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <button
                        onClick={() => toggleExpand(item.id)}
                        className="text-muted-foreground hover:text-foreground p-0.5 rounded transition-colors"
                      >
                        {isExpanded ? (
                          <CaretDownIcon className="w-3.5 h-3.5" />
                        ) : (
                          <CaretRightIcon className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <span className="text-[10.5px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
                        {item.code}
                      </span>
                      <span className="text-[12.5px] font-semibold text-foreground truncate">
                        {item.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Assignee Avatars */}
                      <div className="flex -space-x-1.5">
                        {item.assignees.map((ass) => (
                          <div
                            key={ass.id}
                            title={ass.name}
                            className={cn(
                              "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white ring-1 ring-background shrink-0",
                              ass.avatarBg || "bg-blue-500",
                            )}
                          >
                            {ass.name.charAt(0)}
                          </div>
                        ))}
                      </div>

                      <span className="text-[11px] font-bold text-foreground w-8 text-right">
                        {item.progress}%
                      </span>
                    </div>
                  </div>

                  {/* Right Timeline Bar View Area */}
                  <div className="flex-1 relative min-h-11.5 flex items-center px-1">
                    {/* Today Line Indicator */}
                    <div className="absolute top-0 bottom-0 left-[36%] w-px bg-blue-500/50 z-20 pointer-events-none stroke-dashed" />

                    {/* Timeline Bar */}
                    <div
                      style={{ left: pos.left, width: pos.width }}
                      className="absolute h-7 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center px-2 z-10 group/bar hover:border-blue-500/70 transition-all cursor-pointer shadow-2xs"
                    >
                      {/* Progress Bar Fill */}
                      <div
                        style={{ width: `${item.progress}%` }}
                        className={cn(
                          "absolute inset-y-0 left-0 rounded-lg bg-linear-to-r transition-all duration-300",
                          item.status === "completed"
                            ? "from-emerald-500 to-teal-500 opacity-90"
                            : "from-blue-600 to-blue-400 opacity-80",
                        )}
                      />

                      {/* Content Label inside bar */}
                      <div className="relative z-10 flex items-center justify-between w-full text-[11px] font-semibold text-foreground px-1 gap-2 truncate">
                        <span className="truncate drop-shadow-xs">
                          {item.title}
                        </span>

                        <div className="flex items-center gap-1 shrink-0">
                          {item.status === "completed" ? (
                            <CheckCircleIcon className="w-3 h-3 text-emerald-400" />
                          ) : item.status === "in_progress" ? (
                            <ClockIcon className="w-3 h-3 text-blue-400 animate-pulse" />
                          ) : (
                            <WarningCircleIcon className="w-3 h-3 text-amber-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
