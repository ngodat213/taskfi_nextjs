"use client";

import { useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import { VelocityMetricsCards } from "@/features/reports/components/velocity-metrics-cards";
import { BurndownChart } from "@/features/reports/components/burndown-chart";
import {
  WorkBreakdownCard,
  VelocityGrowthCard,
} from "@/features/reports/components/category-distribution-card";
import { DailyBurnTable } from "@/features/reports/components/daily-burn-table";
import { getReportDataByProject } from "@/features/reports/mocks/reports.mocks";

import {
  STAGGER_CONTAINER_VARIANTS,
  SPRING_CARD_VARIANTS,
} from "@/constants/animations";

const containerVariants: Variants = STAGGER_CONTAINER_VARIANTS;
const itemVariants: Variants = SPRING_CARD_VARIANTS;

interface DashboardReportsTabProps {
  projectId: string;
}

export function DashboardReportsTab({ projectId }: DashboardReportsTabProps) {
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
      {/* 4 Velocity Metrics */}
      <motion.div variants={itemVariants}>
        <VelocityMetricsCards summary={reportData.summary} />
      </motion.div>

      {/* 3 Main Charts Row */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 xl:grid-cols-3 gap-3.5"
      >
        <BurndownChart data={reportData.burndown} />
        <WorkBreakdownCard categories={reportData.categories} />
        <VelocityGrowthCard sprintHistory={reportData.sprintHistory} />
      </motion.div>

      {/* Daily Burn Rate & Scope Log Table */}
      <motion.div variants={itemVariants}>
        <DailyBurnTable data={reportData.burndown} />
      </motion.div>
    </motion.div>
  );
}
