"use client";

import { useMemo } from "react";
import { VideoCameraIcon, CalendarBlankIcon } from "@phosphor-icons/react/dist/ssr";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { CalendarEvent } from "@/features/calendar/types/calendar.types";

interface CalendarAgendaTabProps {
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
}

const FULL_DAY_HEADERS = [
  { dayIndex: 0, title: "Monday, July 20", dateStr: "Jul 20" },
  { dayIndex: 1, title: "Tuesday, July 21", dateStr: "Jul 21" },
  {
    dayIndex: 2,
    title: "Wednesday, July 22",
    isToday: true,
    dateStr: "Jul 22",
  },
  { dayIndex: 3, title: "Thursday, July 23", dateStr: "Jul 23" },
  { dayIndex: 4, title: "Friday, July 24", dateStr: "Jul 24" },
  { dayIndex: 5, title: "Saturday, July 25", dateStr: "Jul 25" },
  { dayIndex: 6, title: "Sunday, July 26", dateStr: "Jul 26" },
];

export function CalendarAgendaTab({
  events,
  onSelectEvent,
}: CalendarAgendaTabProps) {
  const groupedEvents = useMemo(() => {
    const map = new Map<number, CalendarEvent[]>();
    events.forEach((evt) => {
      const list = map.get(evt.dayIndex) || [];
      list.push(evt);
      map.set(evt.dayIndex, list);
    });

    return FULL_DAY_HEADERS.map((day) => ({
      ...day,
      items: (map.get(day.dayIndex) || []).sort(
        (a, b) => a.startHour - b.startHour,
      ),
    })).filter((group) => group.items.length > 0);
  }, [events]);

  if (groupedEvents.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
        <CalendarBlankIcon className="w-10 h-10 mb-3 opacity-40" />
        <h4 className="text-[15px] font-semibold text-foreground">
          No Meetings Found
        </h4>
        <p className="text-[13px] text-muted-foreground mt-1 max-w-sm">
          No scheduled agenda items match your current search or filter
          criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto flex flex-col gap-6 py-1">
      {/* Chronological Agenda Timeline */}
      <div className="flex flex-col gap-8">
        {groupedEvents.map((group) => (
          <div key={group.dayIndex} className="flex flex-col gap-3">
            {/* Day Header Badge */}
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "px-3 py-1 rounded-lg text-[12px] font-bold flex items-center gap-1.5 border shadow-2xs",
                  group.isToday
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary text-foreground border-border/60",
                )}
              >
                <CalendarBlankIcon className="w-3.5 h-3.5" />
                <span>{group.title}</span>
                {group.isToday && (
                  <span className="ml-1 px-1.5 py-0.2 rounded text-[10px] uppercase font-black bg-background text-foreground">
                    Today
                  </span>
                )}
              </div>
              <div className="flex-1 h-px bg-border/40" />
            </div>

            {/* Day Items Grid */}
            <div className="flex flex-col gap-3 pl-1 sm:pl-3 border-l-2 border-border/40 ml-4 py-1">
              {group.items.map((evt) => {
                const isLiveNow = evt.startHour === 10 && evt.dayIndex === 2; // Wed 10:00 Live demo

                return (
                  <motion.div
                    key={evt.id}
                    onClick={() => onSelectEvent(evt)}
                    whileHover={{ y: -3, scale: 1.006 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="relative ml-3 bg-card border border-border/70 hover:border-primary/50 hover:bg-card/95 rounded-2xl p-4 sm:p-4.5 shadow-2xs hover:shadow-md transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group select-none"
                  >
                    {/* Timeline Node Indicator */}
                    <div
                      className={cn(
                        "absolute -left-4.75 top-6 w-2.5 h-2.5 rounded-full border-2 bg-background transition-all duration-200 group-hover:scale-125 group-hover:border-primary",
                        isLiveNow
                          ? "border-emerald-500 bg-emerald-500 ring-4 ring-emerald-500/20"
                          : "border-muted-foreground/40",
                      )}
                    />

                    {/* Left Event Content */}
                    <div className="flex flex-col gap-2 min-w-0 flex-1">
                      {/* Time & Live Status */}
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-[11.5px] font-bold text-muted-foreground bg-secondary border border-border/50 px-2.5 py-0.5 rounded-md tracking-tight group-hover:border-primary/30 transition-colors">
                          {evt.startTimeStr} - {evt.endTimeStr}
                        </span>
                        <span className="text-[11.5px] text-muted-foreground font-medium">
                          ({evt.durationHours}h)
                        </span>

                        {isLiveNow && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            LIVE NOW
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h4 className="text-[15px] font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">
                        {evt.title}
                      </h4>

                      {/* Agenda Chips */}
                      {evt.agenda && evt.agenda.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-0.5">
                          {evt.agenda.map((item, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-secondary text-muted-foreground border border-border/40 group-hover:border-border/80 transition-colors"
                            >
                              • {item}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Attendees Avatars */}
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/30">
                        <div className="flex -space-x-1.5 overflow-hidden">
                          {evt.attendees.map((att, idx) => (
                            <div
                              key={idx}
                              className={cn(
                                "flex h-6 w-6 rounded-full ring-2 ring-card text-[10px] font-bold items-center justify-center text-foreground border border-border/40 transition-transform group-hover:scale-110",
                                att.avatarBg || "bg-secondary",
                              )}
                              title={att.name}
                            >
                              {att.name[0]}
                            </div>
                          ))}
                        </div>
                        <span className="text-[11.5px] text-muted-foreground font-medium group-hover:text-foreground transition-colors">
                          {evt.attendees.map((a) => a.name).join(", ")}
                        </span>
                      </div>
                    </div>

                    {/* Right Call Action */}
                    {evt.meetingUrl && (
                      <div className="flex items-center gap-2 shrink-0 md:self-center">
                        <a
                          href={evt.meetingUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-4 py-2 rounded-xl text-[12px] font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all flex items-center gap-2 shadow-2xs cursor-pointer group-hover:shadow-md"
                        >
                          <VideoCameraIcon className="w-4 h-4" />
                          <span>Join Call</span>
                        </a>
                      </div>
                    )}
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
