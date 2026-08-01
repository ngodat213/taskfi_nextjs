"use client";

import {
  ArrowUpRightIcon,
  ClockIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react/dist/ssr";

import { StatCard } from "@/components/ui/data-display/stat-card";
import { TimelineSummary } from "@/features/timeline/types/timeline.types";

interface TimelineSummaryCardsProps {
  summary: TimelineSummary;
}

export function TimelineSummaryCards({ summary }: TimelineSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 max-w-4xl">
      {/* Active Epics */}
      <StatCard
        label="Active Epics & Features"
        value={summary.activeEpics}
        subValue="epics in flight"
        trend={{
          text: "4 epics target Q3 delivery",
          isPositive: true,
          icon: <ArrowUpRightIcon className="w-3.5 h-3.5 stroke-[2.5]" />,
        }}
      />

      {/* Total Milestones */}
      <StatCard
        label="Key Milestones"
        value={summary.totalMilestones}
        subValue="milestones planned"
        trend={{
          text: "3 deliverables completed",
          isPositive: true,
          icon: <ArrowUpRightIcon className="w-3.5 h-3.5 stroke-[2.5]" />,
        }}
      />

      {/* Schedule Health / On Track */}
      <StatCard
        label="Schedule Health"
        value={`${summary.onTrackPercentage}%`}
        subValue="on track"
        trend={{
          text: "Low risk of delay",
          isPositive: true,
          icon: <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-500" />,
        }}
      />

      {/* Days to Release */}
      <StatCard
        label="Next Major Release"
        value={summary.daysToNextRelease}
        subValue="days remaining"
        footer={
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground">
            <ClockIcon className="w-3.5 h-3.5 text-blue-500" />
            <span>Target: Aug 01, 2026</span>
          </div>
        }
      />
    </div>
  );
}
