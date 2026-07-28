"use client";

import { SprintMetricsSummary } from "@/features/reports/types/reports.types";
import { ArrowUpRightIcon, ClockIcon } from "@phosphor-icons/react/dist/ssr";
import { StatCard } from "@/components/ui/data-display/stat-card";

interface VelocityMetricsCardsProps {
  summary: SprintMetricsSummary;
}

export function VelocityMetricsCards({ summary }: VelocityMetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 w-full">
      {/* Metric 1: Sprint Velocity */}
      <StatCard
        hoverEffect
        label="Sprint Velocity"
        value={summary.completedPoints}
        subValue={`/ ${summary.totalStoryPoints} pts`}
        trend={{
          text: "+82.8% (+7.4%)",
          isPositive: true,
          icon: <ArrowUpRightIcon className="w-3.5 h-3.5 stroke-[2.5]" />,
        }}
      />

      {/* Metric 2: Task Execution */}
      <StatCard
        hoverEffect
        label="Task Execution"
        value={summary.completedTasks}
        subValue={`/ ${summary.totalTasks} tasks`}
        trend={{
          text: "+82.1% completed",
          isPositive: true,
          icon: <ArrowUpRightIcon className="w-3.5 h-3.5 stroke-[2.5]" />,
        }}
      />

      {/* Metric 3: Cycle Time */}
      <StatCard
        hoverEffect
        label="Cycle Time"
        value={summary.avgCycleTimeDays}
        subValue="days / task"
        trend={{
          text: "+15% resolution pace",
          isPositive: true,
          icon: <ArrowUpRightIcon className="w-3.5 h-3.5 stroke-[2.5]" />,
        }}
      />

      {/* Metric 4: Time Remaining */}
      <StatCard
        hoverEffect
        label="Time Remaining"
        value={summary.daysRemaining}
        subValue="days left"
        footer={
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground">
            <ClockIcon className="w-3.5 h-3.5 text-blue-500" />
            <span>Sprint ends Jul 24, 2026</span>
          </div>
        }
      />
    </div>
  );
}
