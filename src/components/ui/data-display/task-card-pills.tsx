"use client";

import { CalendarBlankIcon } from "@phosphor-icons/react/dist/ssr";

import { Badge } from "@/components/ui/data-display/badge";
import { cn } from "@/utils/cn";

interface DueDatePillProps {
  dueDate?: string | null;
  isCompleted?: boolean;
  className?: string;
}

export function DueDatePill({
  dueDate,
  isCompleted = false,
  className,
}: DueDatePillProps) {
  if (!dueDate) return null;

  const dateObj = new Date(dueDate);
  if (isNaN(dateObj.getTime())) return null;

  const formattedDate = dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const due = new Date(dateObj);
  due.setHours(0, 0, 0, 0);

  const isOverdue = due < now && !isCompleted;

  return (
    <Badge
      variant={isOverdue ? "red" : "slate"}
      className={cn(isOverdue && "font-semibold", className)}
    >
      <CalendarBlankIcon className="w-3.5 h-3.5 shrink-0" />
      <span>{formattedDate}</span>
    </Badge>
  );
}

interface SubtaskProgressRingProps {
  completed: number;
  total: number;
  className?: string;
}

export function SubtaskProgressRing({
  completed,
  total,
  className,
}: SubtaskProgressRingProps) {
  if (total <= 0) return null;

  const percentage = Math.min(100, Math.max(0, (completed / total) * 100));
  const radius = 5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const isAllDone = completed === total && total > 0;

  return (
    <Badge variant="slate" className={className}>
      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 14 14">
        {/* Background track circle */}
        <circle
          cx="7"
          cy="7"
          r={radius}
          className="text-muted-foreground/25"
          stroke="currentColor"
          strokeWidth="1.8"
          fill="none"
        />
        {/* Progress fill circle */}
        <circle
          cx="7"
          cy="7"
          r={radius}
          className={isAllDone ? "text-emerald-500" : "text-blue-500"}
          stroke="currentColor"
          strokeWidth="1.8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 7 7)"
        />
      </svg>
      <span>
        {completed}/{total}
      </span>
    </Badge>
  );
}
