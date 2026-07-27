"use client";

import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { Input } from "@/components/ui/forms/input";
import { Select } from "@/components/ui/forms/select";

interface RetrosTabFilterBarProps {
  selectedSprint?: string;
  onSprintChange?: (val: string) => void;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

export function RetrosTabFilterBar({
  selectedSprint = "sprint-24",
  onSprintChange,
  searchQuery = "",
  onSearchChange,
}: RetrosTabFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 w-full">
      <div className="relative">
        <MagnifyingGlass className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        <Input
          type="text"
          variant="pill"
          placeholder="Search retro notes..."
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="w-60 h-8 pl-8 pr-3 text-[12.5px]"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <span className="text-[11.5px] font-semibold text-muted-foreground uppercase tracking-wider">
          Sprint:
        </span>
        <Select
          variant="pill"
          value={selectedSprint}
          onChange={(val) => onSprintChange?.(val)}
          wrapperClassName="w-fit min-w-[140px]"
          className="h-8 text-[12px] font-semibold border-border/80"
        >
          <option value="sprint-24">Sprint 24 (Current)</option>
          <option value="sprint-23">Sprint 23 (Previous)</option>
          <option value="sprint-22">Sprint 22 (Completed)</option>
        </Select>
      </div>
    </div>
  );
}
