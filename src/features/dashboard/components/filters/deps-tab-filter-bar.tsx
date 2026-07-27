"use client";

import {
  MagnifyingGlass,
  SquaresFour,
  ListBullets,
} from "@phosphor-icons/react/dist/ssr";
import { Input } from "@/components/ui/forms/input";
import { Select } from "@/components/ui/forms/select";
import {
  SegmentedControl,
  SegmentedControlTab,
} from "@/components/ui/forms/segmented-control";

const DEPS_VIEW_MODE_TABS: SegmentedControlTab[] = [
  { id: "graph", label: "Visual Graph", icon: SquaresFour },
  { id: "list", label: "List Matrix", icon: ListBullets },
];

interface DepsTabFilterBarProps {
  viewMode: "graph" | "list";
  onViewModeChange: (mode: "graph" | "list") => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  filterRisk: string;
  onFilterRiskChange: (risk: string) => void;
}

export function DepsTabFilterBar({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  filterRisk,
  onFilterRiskChange,
}: DepsTabFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 w-full">
      <div className="flex items-center gap-3">
        <div className="relative">
          <MagnifyingGlass className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            variant="pill"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-60 h-8 pl-8 pr-3 text-[12.5px]"
          />
        </div>
        <Select
          value={filterRisk}
          onChange={(val) => onFilterRiskChange(val)}
          className="h-8 text-[12px] font-semibold rounded-full border-border/80 w-36"
        >
          <option value="all">All Risks</option>
          <option value="critical">Critical Risk</option>
          <option value="warning">Warning Risk</option>
          <option value="resolved">Resolved</option>
        </Select>
      </div>

      <SegmentedControl
        tabs={DEPS_VIEW_MODE_TABS}
        activeTab={viewMode}
        onTabChange={(id) => onViewModeChange(id as "graph" | "list")}
        size="sm"
        className="ml-auto"
      />
    </div>
  );
}
