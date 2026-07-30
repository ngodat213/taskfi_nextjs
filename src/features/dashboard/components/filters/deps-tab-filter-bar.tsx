"use client";

import {
  MagnifyingGlassIcon,
  SquaresFourIcon,
  ListBulletsIcon,
  CheckSquareIcon,
  SquareIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Input } from "@/components/ui/forms/input";
import { Select } from "@/components/ui/forms/select";
import {
  SegmentedControl,
  SegmentedControlTab,
} from "@/components/ui/forms/segmented-control";
import { StatusBadge } from "@/features/dashboard/components/issue-table-row";
import { IssueStatus } from "@/types/issue.types";
import { cn } from "@/utils/cn";

const DEPS_VIEW_MODE_TABS: SegmentedControlTab[] = [
  { id: "graph", label: "Visual Graph", icon: SquaresFourIcon },
  { id: "list", label: "List Matrix", icon: ListBulletsIcon },
];

const AVAILABLE_STATUSES: { id: string; label: string }[] = [
  { id: "to do", label: "To Do" },
  { id: "in progress", label: "In Progress" },
  { id: "in review", label: "In Review" },
  { id: "done", label: "Done" },
];

interface DepsTabFilterBarProps {
  viewMode: "graph" | "list";
  onViewModeChange: (mode: "graph" | "list") => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  filterRisk: string;
  onFilterRiskChange: (risk: string) => void;
  selectedStatuses?: string[];
  onSelectedStatusesChange?: (statuses: string[]) => void;
}

export function DepsTabFilterBar({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  filterRisk,
  onFilterRiskChange,
  selectedStatuses = ["to do", "in progress", "in review", "done"],
  onSelectedStatusesChange,
}: DepsTabFilterBarProps) {
  const toggleStatus = (id: string) => {
    if (!onSelectedStatusesChange) return;
    const isSelected = selectedStatuses.includes(id);
    if (isSelected) {
      onSelectedStatusesChange(selectedStatuses.filter((s) => s !== id));
    } else {
      onSelectedStatusesChange([...selectedStatuses, id]);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 w-full">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            variant="pill"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-52 h-8 pl-8 pr-3 text-[12.5px]"
          />
        </div>

        {/* Risk Filter */}
        <Select
          value={filterRisk}
          onChange={(val) => onFilterRiskChange(val)}
          className="h-8 text-[12px] font-semibold rounded-full border-border/80 w-32"
        >
          <option value="all">All Risks</option>
          <option value="critical">Critical Risk</option>
          <option value="warning">Warning Risk</option>
          <option value="resolved">Resolved</option>
        </Select>

        {/* Status Filter Toggle Buttons */}
        <div className="flex items-center gap-1.5 border-l border-border/60 pl-3">
          {AVAILABLE_STATUSES.map((st) => {
            const isSelected = selectedStatuses.includes(st.id);
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => toggleStatus(st.id)}
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[11.5px] font-medium transition-all cursor-pointer select-none",
                  isSelected
                    ? "bg-accent/60 border-border text-foreground shadow-2xs"
                    : "bg-muted/30 border-border/40 text-muted-foreground opacity-40 hover:opacity-75 hover:bg-muted/50",
                )}
              >
                {isSelected ? (
                  <CheckSquareIcon
                    className="w-3.5 h-3.5 text-primary shrink-0"
                    weight="fill"
                  />
                ) : (
                  <SquareIcon className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
                )}
                <StatusBadge status={st.id as IssueStatus} />
              </button>
            );
          })}
        </div>
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
