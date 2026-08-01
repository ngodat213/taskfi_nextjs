"use client";

import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";

import { Input } from "@/components/ui/forms/input";
import { Select } from "@/components/ui/forms/select";

interface ArchivedTabFilterBarProps {
  filterType: string;
  onFilterTypeChange: (type: string) => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
}

export function ArchivedTabFilterBar({
  filterType,
  onFilterTypeChange,
  searchQuery,
  onSearchChange,
}: ArchivedTabFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 w-full">
      <div className="relative">
        <MagnifyingGlassIcon className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        <Input
          type="text"
          variant="pill"
          placeholder="Search archived items..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-60 h-8 pl-8 pr-3 text-[12.5px]"
        />
      </div>
      <Select
        variant="pill"
        value={filterType}
        onChange={(val) => onFilterTypeChange(val)}
        wrapperClassName="w-fit min-w-[140px] ml-auto"
        className="h-8 text-[12px] font-semibold border-border/80 w-36"
      >
        <option value="all">All Items</option>
        <option value="issue">Issues</option>
        <option value="sprint">Sprints</option>
        <option value="document">Documents</option>
      </Select>
    </div>
  );
}
