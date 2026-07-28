"use client";

import { useState } from "react";
import { CalendarBlankIcon, CaretLeftIcon, CaretRightIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

interface CalendarDatePickerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: number;
  onSelectDay: (day: number) => void;
}

const MINI_DAYS_HEADER = ["M", "T", "W", "T", "F", "S", "S"];
const MINI_MONTH_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export function CalendarDatePickerDialog({
  isOpen,
  onClose,
  selectedDay,
  onSelectDay,
}: CalendarDatePickerDialogProps) {
  const [currentMonth] = useState("July 2026");

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0 bg-black/40 backdrop-blur-xs">
        {/* Backdrop overlay */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Calendar Dialog Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -6 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="relative z-10 w-full max-w-[320px] bg-card border border-border/80 rounded-3xl p-5 shadow-2xl overflow-hidden flex flex-col gap-4 select-none"
        >
          {/* Top Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CalendarBlankIcon className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-[15px] font-bold text-foreground tracking-tight">
                {currentMonth}
              </h3>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <CaretLeftIcon className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <CaretRightIcon className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer ml-1"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days Header Row */}
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-muted-foreground pt-1">
            {MINI_DAYS_HEADER.map((d, idx) => (
              <div key={idx} className="py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Month Days Grid */}
          <div className="grid grid-cols-7 gap-1.5 text-center text-[13px]">
            {/* Previous month placeholders */}
            {[29, 30].map((d) => (
              <div
                key={`prev-${d}`}
                className="py-1 text-muted-foreground/30 text-[12px]"
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
                  onClick={() => {
                    onSelectDay(day);
                    onClose();
                  }}
                  className={cn(
                    "w-8 h-8 mx-auto rounded-xl flex items-center justify-center font-semibold transition-all cursor-pointer text-[13px]",
                    isSelected
                      ? "bg-foreground text-background font-bold shadow-md scale-105"
                      : isToday
                        ? "bg-secondary text-blue-600 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-800"
                        : "text-foreground hover:bg-secondary/80",
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer Action */}
          <div className="pt-2 border-t border-border/40 flex items-center justify-between">
            <span className="text-[11.5px] text-muted-foreground font-medium">
              Today is July 22, 2026
            </span>
            <button
              onClick={() => {
                onSelectDay(22);
                onClose();
              }}
              className="px-3 py-1 text-[12px] font-bold rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer shadow-2xs"
            >
              Jump to Today
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
