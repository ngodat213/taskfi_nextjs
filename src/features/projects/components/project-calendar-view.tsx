"use client";

import { useState } from "react";
import {
  CalendarBlank,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/utils/cn";

interface ProjectEvent {
  id: string;
  projectName: string;
  projectKey: string;
  title: string;
  date: string;
  type: "release" | "milestone" | "sprint";
  color: string;
}

const MOCK_PROJECT_EVENTS: ProjectEvent[] = [
  {
    id: "pe-1",
    projectName: "TaskFi Web v1.4",
    projectKey: "TFK",
    title: "v1.4 Production Release",
    date: "2026-07-24",
    type: "release",
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  },
  {
    id: "pe-2",
    projectName: "NestJS Gateway",
    projectKey: "NEST",
    title: "Sprint 24 Code Freeze",
    date: "2026-07-22",
    type: "sprint",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  },
  {
    id: "pe-3",
    projectName: "Mobile App React Native",
    projectKey: "MOB",
    title: "Beta iOS TestFlight Upload",
    date: "2026-07-28",
    type: "milestone",
    color: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  },
  {
    id: "pe-4",
    projectName: "Design System",
    projectKey: "DS",
    title: "UI Tokens Spec Review",
    date: "2026-07-16",
    type: "milestone",
    color: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  },
];

export function ProjectCalendarView() {
  const [currentMonth] = useState("July 2026");

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  // 31 days grid for July 2026 (July 1st is Wednesday -> 2 empty slots)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const leadingPadding = 2; // Wed start

  return (
    <div className="bg-[#1C1C1C] border border-border/70 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
      {/* Calendar Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0">
            <CalendarBlank className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-[15px] font-bold text-foreground flex items-center gap-2">
              <span>Project Deliverables & Milestones</span>
              <span className="text-[11px] font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/30">
                July 2026
              </span>
            </h4>
            <p className="text-[12px] text-muted-foreground">
              Scheduled project releases, sprint target deadlines, and key milestones
            </p>
          </div>
        </div>

        {/* Month Navigator Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button className="p-1.5 rounded-lg bg-secondary/80 text-muted-foreground hover:text-foreground hover:bg-secondary border border-border/60 transition-colors cursor-pointer">
            <CaretLeft className="w-4 h-4" />
          </button>
          <span className="text-[13px] font-bold text-foreground px-2">
            {currentMonth}
          </span>
          <button className="p-1.5 rounded-lg bg-secondary/80 text-muted-foreground hover:text-foreground hover:bg-secondary border border-border/60 transition-colors cursor-pointer">
            <CaretRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-2 text-center text-[11.5px] font-bold text-muted-foreground uppercase tracking-wider">
        {daysOfWeek.map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 text-[12px]">
        {/* Leading empty slots */}
        {Array.from({ length: leadingPadding }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="min-h-24 bg-secondary/20 rounded-xl border border-transparent"
          />
        ))}

        {/* Month Day Cells */}
        {daysInMonth.map((dayNum) => {
          const formattedDay = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
          const dateStr = `2026-07-${formattedDay}`;
          const dayEvents = MOCK_PROJECT_EVENTS.filter((e) => e.date === dateStr);
          const isToday = dayNum === 23;

          return (
            <div
              key={`day-${dayNum}`}
              className={cn(
                "min-h-24 p-2 rounded-xl border flex flex-col gap-1.5 transition-all duration-200 hover:border-border/80",
                isToday
                  ? "bg-blue-500/10 border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.15)]"
                  : "bg-[#232323]/60 border-border/40 hover:bg-[#232323]",
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-[11.5px] font-bold",
                    isToday
                      ? "bg-blue-500 text-white shadow-xs"
                      : "text-muted-foreground",
                  )}
                >
                  {dayNum}
                </span>
                {isToday && (
                  <span className="text-[9.5px] font-extrabold text-blue-400 uppercase tracking-wide">
                    Today
                  </span>
                )}
              </div>

              {/* Day Events List */}
              <div className="flex flex-col gap-1 overflow-y-auto no-scrollbar">
                {dayEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className={cn(
                      "p-1.5 rounded-lg border text-[10.5px] flex flex-col gap-0.5 transition-transform hover:scale-102 cursor-pointer",
                      ev.color,
                    )}
                  >
                    <span className="font-extrabold line-clamp-1">
                      {ev.projectName}
                    </span>
                    <span className="font-semibold text-foreground/90 line-clamp-1">
                      {ev.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
