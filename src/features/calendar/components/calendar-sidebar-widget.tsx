"use client";

import { useState } from "react";
import {
  CalendarBlank,
  CaretLeft,
  CaretRight,
  Rocket,
  Flame,
  PaintBrush,
  ArrowsClockwise,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/utils/cn";

interface CalendarSidebarWidgetProps {
  selectedDay: number;
  onSelectDay: (day: number) => void;
}

const MINI_DAYS_HEADER = ["M", "T", "W", "T", "F", "S", "S"];
const MINI_MONTH_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

const SPRINT_MILESTONES = [
  {
    id: "ms-1",
    title: "TaskFi v1.4 Release Deployment",
    date: "July 22, 2026",
    dayNumber: 22,
    tag: "Release",
    icon: Rocket,
    iconColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    id: "ms-2",
    title: "NestJS Socket Cluster Rollout",
    date: "July 24, 2026",
    dayNumber: 24,
    tag: "Backend",
    icon: Flame,
    iconColor: "text-orange-500 bg-orange-500/10 border-orange-500/20",
  },
  {
    id: "ms-3",
    title: "Design System Tokens Lock",
    date: "July 25, 2026",
    dayNumber: 25,
    tag: "UI/UX",
    icon: PaintBrush,
    iconColor: "text-purple-500 bg-purple-500/10 border-purple-500/20",
  },
];

export function CalendarSidebarWidget({
  selectedDay,
  onSelectDay,
}: CalendarSidebarWidgetProps) {
  const [syncedTime] = useState("Just now");

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Mini Month Picker Card */}
      <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-2xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarBlank className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-[13.5px] font-bold text-foreground">
              July 2026
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              <CaretLeft className="w-3.5 h-3.5" />
            </button>
            <button className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              <CaretRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mini Days Header */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10.5px] font-bold text-muted-foreground pt-1">
          {MINI_DAYS_HEADER.map((d, idx) => (
            <div key={idx}>{d}</div>
          ))}
        </div>

        {/* Mini Month Days Grid */}
        <div className="grid grid-cols-7 gap-1 text-center text-[12px]">
          {/* Previous month placeholders */}
          {[29, 30].map((d) => (
            <div
              key={`prev-${d}`}
              className="py-1 text-muted-foreground/30 text-[11px]"
            >
              {d}
            </div>
          ))}

          {MINI_MONTH_DAYS.map((day) => {
            const isSelected = selectedDay === day;
            const isToday = day === 22;

            return (
              <button
                key={day}
                onClick={() => onSelectDay(day)}
                className={cn(
                  "w-7 h-7 mx-auto rounded-lg flex items-center justify-center font-medium transition-all cursor-pointer text-[12px]",
                  isSelected
                    ? "bg-primary text-primary-foreground font-bold shadow-2xs"
                    : isToday
                      ? "bg-secondary text-blue-600 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-800"
                      : "text-foreground hover:bg-secondary",
                )}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sprint Milestones & Deadlines Card */}
      <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-2xs flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
          <h3 className="text-[13px] font-bold text-foreground tracking-tight">
            Sprint Milestones
          </h3>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary text-muted-foreground border border-border/50">
            Sprint 14
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {SPRINT_MILESTONES.map((ms) => {
            const IconComp = ms.icon;
            const isSelectedDay = selectedDay === ms.dayNumber;

            return (
              <div
                key={ms.id}
                onClick={() => onSelectDay(ms.dayNumber)}
                className={cn(
                  "p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 group",
                  isSelectedDay
                    ? "bg-secondary/90 border-border shadow-2xs ring-1 ring-border"
                    : "bg-muted/30 border-border/50 hover:bg-secondary/60",
                )}
              >
                <div
                  className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border mt-0.5",
                    ms.iconColor,
                  )}
                >
                  <IconComp className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[12.5px] font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {ms.title}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {ms.date}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sync Status Badge Card */}
      <div className="bg-card border border-border/80 rounded-2xl p-3 px-3.5 shadow-2xs flex items-center justify-between text-[11.5px]">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium text-foreground">Google Calendar</span>
        </div>
        <div className="flex items-center gap-1 text-[10.5px] text-muted-foreground">
          <ArrowsClockwise className="w-3 h-3" /> Synced {syncedTime}
        </div>
      </div>
    </div>
  );
}
