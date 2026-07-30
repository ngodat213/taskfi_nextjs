"use client";

import { useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/ui/layout/page-header";
import {
  Button,
  ButtonVariant,
  ButtonSize,
} from "@/components/ui/actions/button";
import {
  SegmentedControl,
  SegmentedControlTab,
} from "@/components/ui/forms/segmented-control";
import { Select } from "@/components/ui/forms/select";
import { useGroups } from "@/features/workspace-settings/hooks/use-groups";
import { APP_CONFIG } from "@/config/app.config";
import {
  DownloadSimpleIcon,
  UsersThreeIcon,
  CalendarCheckIcon,
  SquaresFourIcon,
} from "@phosphor-icons/react/dist/ssr";
import { motion, AnimatePresence } from "framer-motion";
import { TAB_CONTENT_VARIANTS } from "@/constants/animations";

import { getReportDataByProject } from "@/features/reports/mocks/reports.mocks";

import { VelocityMetricsCards } from "./velocity-metrics-cards";
import { BurndownChart } from "./burndown-chart";
import { TeamWorkloadTable } from "./team-workload-card";
import {
  WorkBreakdownCard,
  VelocityGrowthCard,
} from "./category-distribution-card";
import { DailyBurnTable } from "./daily-burn-table";
import { CapacitySummaryCards } from "./capacity-summary-cards";

const REPORT_TAB_OPTIONS: SegmentedControlTab[] = [
  { id: "overview", label: "Overview", icon: SquaresFourIcon },
  { id: "workload", label: "Team Capacity", icon: UsersThreeIcon },
];

export function ReportsView() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [selectedSprint, setSelectedSprint] =
    useState<string>("Sprint 24 (Active)");

  // Fetch groups dynamically from workspace
  const { data: groupsResponse } = useGroups({
    limit: APP_CONFIG.PAGINATION.MAX_LIMIT,
  });
  const groups = groupsResponse?.data?.data || [];

  // Get report dataset based on selected project & group
  const reportData = getReportDataByProject(selectedProject, selectedGroup);

  return (
    <PageContainer>
      <div className="flex-1 w-full flex flex-col min-h-0">
        {/* Header Section using reusable PageHeader component */}
        <div className="bg-transparent border-b border-border/60 shrink-0 relative z-30">
          <div className="w-full px-4 sm:px-6 md:px-8 pt-5 pb-4">
            <PageHeader
              title="Team Velocity & Burndown Analytics"
              description="Real-time insights on sprint burndown, team member capacity, cycle time, and story points velocity."
              actions={
                <Button
                  variant={ButtonVariant.Primary}
                  size={ButtonSize.Sm}
                  className="gap-1.5 text-[12px] shadow-2xs"
                >
                  <DownloadSimpleIcon
                    className="w-3.5 h-3.5"
                    strokeWidth={2.5}
                  />
                  Export Report
                </Button>
              }
            >
              {/* Sub-header Filter & Navigation Toolbar passed as children of PageHeader */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-30 pt-1">
                {/* Segmented Control View Tabs */}
                <SegmentedControl
                  tabs={REPORT_TAB_OPTIONS}
                  activeTab={activeTab}
                  onTabChange={(id) => setActiveTab(id)}
                />

                {/* Filters Toolbar Row */}
                <div className="flex flex-wrap items-center gap-2.5 relative z-30">
                  {/* Group Selector */}
                  <Select
                    value={selectedGroup}
                    onChange={(val) => {
                      setSelectedGroup(val);
                      setSelectedProject("all");
                    }}
                    wrapperClassName="w-[130px] sm:w-[140px]"
                  >
                    <option value="all">All Groups</option>
                    {groups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </Select>

                  {/* Project Selector */}
                  <Select
                    value={selectedProject}
                    onChange={(val) => setSelectedProject(val)}
                    wrapperClassName="w-[160px] sm:w-[175px]"
                  >
                    <option value="all">All Projects</option>
                    <option value="proj-web">TaskFi Web Platform</option>
                    <option value="proj-api">NestJS Gateway API</option>
                  </Select>

                  {/* Sprint Selector */}
                  <Select
                    value={selectedSprint}
                    onChange={(val) => setSelectedSprint(val)}
                    wrapperClassName="w-[145px] sm:w-[155px]"
                  >
                    <option value="Sprint 24 (Active)">
                      Sprint 24 (Active)
                    </option>
                    <option value="Sprint 23">Sprint 23</option>
                    <option value="Sprint 22">Sprint 22</option>
                    <option value="Sprint 21">Sprint 21</option>
                  </Select>

                  {/* Period Badge */}
                  <div className="flex items-center gap-2 text-[12px] text-muted-foreground font-semibold shrink-0 bg-card px-3 py-1.5 rounded-full border border-border/80 shadow-2xs h-9.5">
                    <CalendarCheckIcon className="w-4 h-4 text-blue-500" />
                    <span className="whitespace-nowrap">
                      Jul 13 - Jul 24, 2026
                    </span>
                  </div>
                </div>
              </div>
            </PageHeader>
          </div>
        </div>

        {/* Content Body Area */}
        <div className="flex-1 w-full px-4 sm:px-6 md:px-8 py-5 overflow-y-auto flex flex-col gap-4 relative z-10">
          <AnimatePresence mode="wait">
            {/* TAB 1: OVERVIEW */}
            {activeTab === "overview" && (
              <motion.div
                key={`tab-overview-${selectedGroup}-${selectedProject}`}
                variants={TAB_CONTENT_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col gap-4"
              >
                <VelocityMetricsCards summary={reportData.summary} />

                {/* 3 Charts in 1 Single Horizontal Row */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-3.5">
                  <BurndownChart data={reportData.burndown} />
                  <WorkBreakdownCard categories={reportData.categories} />
                  <VelocityGrowthCard
                    sprintHistory={reportData.sprintHistory}
                  />
                </div>

                {/* Daily Story Points Burn Rate & Scope Log */}
                <DailyBurnTable data={reportData.burndown} />
              </motion.div>
            )}

            {/* TAB 3: TEAM CAPACITY */}
            {activeTab === "workload" && (
              <motion.div
                key={`tab-workload-${selectedGroup}-${selectedProject}`}
                variants={TAB_CONTENT_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col gap-6"
              >
                <CapacitySummaryCards />
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <h3 className="text-[13.5px] font-bold text-foreground flex items-center gap-2.5">
                      <UsersThreeIcon className="w-5 h-5 text-blue-500" />
                      <span>
                        Individual Member Capacity & Velocity Breakdown
                      </span>
                    </h3>
                  </div>
                  <TeamWorkloadTable members={reportData.team} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageContainer>
  );
}
