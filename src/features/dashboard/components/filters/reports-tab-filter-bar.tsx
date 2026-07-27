"use client";

import { Select } from "@/components/ui/forms/select";

interface ReportsTabFilterBarProps {
  timeHorizon?: string;
  onTimeHorizonChange?: (val: string) => void;
}

export function ReportsTabFilterBar({
  timeHorizon = "sprint-24",
  onTimeHorizonChange,
}: ReportsTabFilterBarProps) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <span className="text-[11.5px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
        Time Horizon:
      </span>
      <Select
        value={timeHorizon}
        onChange={(val) => onTimeHorizonChange?.(val)}
        className="h-8 text-[12px] font-semibold w-44 rounded-full border-border/80"
      >
        <option value="sprint-24">Sprint 24 (Current)</option>
        <option value="sprint-23">Sprint 23 (Previous)</option>
        <option value="last-30">Last 30 Days</option>
        <option value="last-90">Last 90 Days</option>
      </Select>
    </div>
  );
}
