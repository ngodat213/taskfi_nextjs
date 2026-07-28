"use client";

import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";
import { Input } from "@/components/ui/forms/input";
import { Select } from "@/components/ui/forms/select";

interface WorkloadTabFilterBarProps {
  q: string;
  onSearchChange: (val: string) => void;
  capacityFilter?: string;
  onCapacityChange?: (val: string) => void;
}

export function WorkloadTabFilterBar({
  q,
  onSearchChange,
  capacityFilter = "all",
  onCapacityChange,
}: WorkloadTabFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 w-full">
      <div className="relative">
        <MagnifyingGlassIcon className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        <Input
          type="text"
          variant="pill"
          placeholder="Filter engineers..."
          value={q}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-60 h-8 pl-8 pr-3 text-[12.5px]"
        />
      </div>
      <Select
        value={capacityFilter}
        onChange={(val) => onCapacityChange?.(val)}
        wrapperClassName="w-fit min-w-[140px] ml-auto"
        className="h-8 text-[12.5px] rounded-full border-border text-muted-foreground font-medium hover:bg-muted hover:border-border shadow-sm gap-2"
      >
        <option value="all">All Capacity Statuses</option>
        <option value="optimal">Optimal Load</option>
        <option value="overburdened">High Load / At Risk</option>
        <option value="available">Available</option>
      </Select>
    </div>
  );
}
