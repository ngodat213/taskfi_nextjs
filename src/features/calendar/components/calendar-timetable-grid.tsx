"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { CalendarEvent } from "@/features/calendar/types/calendar.types";
import {
  WEEK_DAYS,
  TIME_SLOTS,
  COLOR_STYLES,
  CALENDAR_CONFIG,
} from "@/features/calendar/constants/calendar.constants";

interface CalendarTimetableGridProps {
  events: CalendarEvent[];
  onSelectEvent: (evt: CalendarEvent) => void;
}

export function CalendarTimetableGrid({
  events,
  onSelectEvent,
}: CalendarTimetableGridProps) {
  const rowHeightPx = CALENDAR_CONFIG.ROW_HEIGHT_PX;

  return (
    <div className="flex-1 overflow-x-auto overflow-y-auto relative">
      <div className="min-w-225 flex flex-col">
        {/* Days Column Headers */}
        <div className="grid grid-cols-[68px_repeat(7,1fr)] border-b border-border/60 sticky top-0 bg-card/95 backdrop-blur-md z-30 shadow-2xs">
          <div className="border-r border-border/60 p-3 text-[11px] font-semibold text-muted-foreground text-center" />
          {WEEK_DAYS.map((d, i) => (
            <div
              key={i}
              className={cn(
                "p-3 text-center border-r border-border/60 flex items-center justify-center gap-2 transition-colors",
                d.isToday ? "bg-primary/5 font-bold" : "",
              )}
            >
              <span className="text-[13px] font-medium text-muted-foreground">
                {d.name}
              </span>
              <span
                className={cn(
                  "text-[13px] font-bold px-2 py-0.5 rounded-full transition-all",
                  d.isToday
                    ? "text-primary-foreground bg-primary shadow-2xs font-black"
                    : "text-foreground font-semibold",
                )}
              >
                {d.date}
              </span>
            </div>
          ))}
        </div>

        {/* Timetable Body (Rows per Hour) */}
        <div className="grid grid-cols-[68px_1fr] relative min-h-208">
          {/* Time Labels Column */}
          <div className="flex flex-col border-r border-border/60 bg-card select-none">
            {TIME_SLOTS.map((slot) => (
              <div
                key={slot.hour}
                style={{ height: `${rowHeightPx}px` }}
                className="pr-3 pt-2 text-[11.5px] font-medium text-muted-foreground text-right border-b border-border/30"
              >
                {slot.label}
              </div>
            ))}
          </div>

          {/* 7 Day Grid Content Container */}
          <div className="grid grid-cols-7 relative">
            {/* Horizontal Grid Line Backgrounds */}
            <div className="absolute inset-0 grid grid-rows-13 pointer-events-none z-0">
              {TIME_SLOTS.map((slot) => (
                <div
                  key={slot.hour}
                  style={{ height: `${rowHeightPx}px` }}
                  className="border-b border-border/30 border-r"
                />
              ))}
            </div>

            {/* 7 Day Columns with strictly bounded Event Cards */}
            {WEEK_DAYS.map((day, dayIdx) => {
              const dayEvents = events.filter((evt) => evt.dayIndex === dayIdx);

              return (
                <div
                  key={dayIdx}
                  className="relative border-r border-border/40 h-full min-h-208 z-10"
                >
                  {dayEvents.map((evt) => {
                    const topPx =
                      (evt.startHour - CALENDAR_CONFIG.START_HOUR) *
                      rowHeightPx;
                    const heightPx = evt.durationHours * rowHeightPx - 6;
                    const style = COLOR_STYLES[evt.color];

                    return (
                      <motion.div
                        key={evt.id}
                        onClick={() => onSelectEvent(evt)}
                        whileHover={{ scale: 1.025, y: -2, zIndex: 40 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                        }}
                        style={{
                          top: `${topPx + 3}px`,
                          height: `${heightPx}px`,
                        }}
                        className={cn(
                          "absolute left-1 right-1 z-20 rounded-xl p-2.5 border shadow-2xs hover:shadow-md hover:brightness-105 flex flex-col justify-between cursor-pointer transition-colors overflow-hidden group select-none",
                          style.card,
                        )}
                      >
                        {/* Event Title */}
                        <div>
                          <h4 className="text-[12.5px] font-bold leading-tight tracking-tight line-clamp-2 text-inherit">
                            {evt.title}
                          </h4>
                        </div>

                        {/* Footer: Time Badge & Attendees */}
                        <div className="flex items-center justify-between gap-1 mt-1 pt-1 border-t border-black/5 dark:border-white/10">
                          <div className="flex items-center gap-1">
                            <span
                              className={cn(
                                "px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-tight",
                                style.badge,
                              )}
                            >
                              {evt.startTimeStr}
                            </span>
                            <span
                              className={cn(
                                "px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-tight hidden xl:inline-block",
                                style.badge,
                              )}
                            >
                              {evt.endTimeStr}
                            </span>
                          </div>

                          {/* Attendee Avatars */}
                          {evt.attendees.length > 0 && (
                            <div className="flex items-center -space-x-1.5">
                              {evt.attendees.map((person, pIdx) => (
                                <div
                                  key={pIdx}
                                  title={person.name}
                                  className={cn(
                                    "w-4.5 h-4.5 rounded-full ring-1 ring-background flex items-center justify-center text-[8.5px] font-bold text-white shrink-0 shadow-2xs",
                                    person.avatarBg,
                                  )}
                                >
                                  {person.name.substring(0, 1)}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
