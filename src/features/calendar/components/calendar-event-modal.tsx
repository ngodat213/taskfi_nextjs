"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Clock,
  VideoCamera,
  ArrowUpRight,
  Sparkle,
  CheckCircle,
  Users,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/utils/cn";
import { CalendarEvent } from "@/features/calendar/types/calendar.types";

interface CalendarEventModalProps {
  event: CalendarEvent | null;
  onClose: () => void;
}

export function CalendarEventModal({
  event,
  onClose,
}: CalendarEventModalProps) {
  return (
    <AnimatePresence>
      {event && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-card border border-border/80 rounded-2xl p-6 shadow-xl flex flex-col gap-5 relative overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                  Meeting Schedule
                </span>
              </div>
              <h3 className="text-[18px] font-bold text-foreground tracking-tight leading-snug">
                {event.title}
              </h3>
            </div>

            {/* Time & Date Card */}
            <div className="p-3.5 bg-secondary/60 rounded-xl border border-border/60 flex items-center gap-3 text-[13px]">
              <div className="w-9 h-9 rounded-lg bg-background border border-border/60 flex items-center justify-center text-foreground shrink-0 shadow-2xs">
                <Clock className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <div className="font-semibold text-foreground">
                  July {event.dayDate}, 2026 ({event.startTimeStr} -{" "}
                  {event.endTimeStr})
                </div>
                <div className="text-[12px] text-muted-foreground">
                  Duration: {event.durationHours} hours
                </div>
              </div>
            </div>

            {/* Video Call Link */}
            {event.meetingUrl && (
              <a
                href={event.meetingUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 bg-primary text-primary-foreground hover:bg-primary/90 text-[13px] font-semibold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <VideoCamera className="w-4 h-4" /> Join Video Call
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            )}

            {/* Agenda */}
            <div>
              <h4 className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                <Sparkle className="w-3.5 h-3.5 text-amber-500" /> Agenda
              </h4>
              <ul className="space-y-2">
                {event.agenda.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-[13px] text-foreground"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Attendees */}
            <div>
              <h4 className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-500" /> Attendees (
                {event.attendees.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {event.attendees.map((person, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/60 border border-border/50 text-[12.5px] font-semibold text-foreground"
                  >
                    <div
                      className={cn(
                        "w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] text-white font-bold",
                        person.avatarBg,
                      )}
                    >
                      {person.name.substring(0, 1)}
                    </div>
                    <span>{person.name}</span>
                    {person.role && (
                      <span className="text-[10.5px] text-muted-foreground font-normal">
                        ({person.role})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
