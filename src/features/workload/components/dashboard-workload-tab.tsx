"use client";

import { motion, type Variants } from "framer-motion";
import { CapacitySummaryCards } from "@/features/reports/components/capacity-summary-cards";
import { TeamWorkloadTable } from "@/features/reports/components/team-workload-card";
import { getReportDataByProject } from "@/features/reports/mocks/reports.mocks";

import { useMemo } from "react";

import {
  STAGGER_CONTAINER_VARIANTS,
  SPRING_CARD_VARIANTS,
} from "@/constants/animations";

const containerVariants: Variants = STAGGER_CONTAINER_VARIANTS;
const itemVariants: Variants = SPRING_CARD_VARIANTS;

interface DashboardWorkloadTabProps {
  projectId: string;
}

export function DashboardWorkloadTab({ projectId }: DashboardWorkloadTabProps) {
  const reportData = useMemo(
    () => getReportDataByProject(projectId),
    [projectId],
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4"
    >
      <motion.div variants={itemVariants}>
        <CapacitySummaryCards />
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col gap-3 pt-1">
        <div className="flex items-center justify-between pb-1">
          <h3 className="text-[13px] font-semibold text-foreground flex items-center gap-2">
            <span>Team Workload</span>
          </h3>
          <span className="text-[11px] text-muted-foreground font-medium bg-card px-2.5 py-0.5 rounded-full border border-border/80">
            {reportData.team.length} Engineers
          </span>
        </div>
        <TeamWorkloadTable members={reportData.team} />
      </motion.div>
    </motion.div>
  );
}
