"use client";

import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { StatCard } from "@/components/ui/data-display/stat-card";

export function CapacitySummaryCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-4xl">
      {/* Optimal Load */}
      <StatCard
        label="Optimal Load"
        value={3}
        subValue="Engineers (50%)"
        trend={{
          text: "Dat Ngo, Alex, Sarah",
          isPositive: true,
          icon: <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />,
        }}
      />

      {/* High Load */}
      <StatCard
        label="High Load / At Risk"
        value={2}
        subValue={
          <span className="text-[12px] font-semibold text-amber-500">
            Engineers (33%)
          </span>
        }
        footer="Maria Garcia, Michael Vance"
      />

      {/* Available Capacity */}
      <StatCard
        label="Available Capacity"
        value={1}
        subValue="Engineer (17%)"
        footer="David Kim (QA Lead)"
      />
    </div>
  );
}
