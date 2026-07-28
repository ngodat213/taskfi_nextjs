"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StackIcon, FlagIcon, PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/ui/layout/page-header";
import { Select } from "@/components/ui/forms/select";
import {
  SegmentedControl,
  SegmentedControlTab,
} from "@/components/ui/forms/segmented-control";
import {
  Button,
  ButtonSize,
  ButtonVariant,
} from "@/components/ui/actions/button";
import { TimelineSummaryCards } from "./timeline-summary-cards";
import { TimelineGanttChart } from "./timeline-gantt-chart";
import { TimelineMilestoneList } from "./timeline-milestone-list";
import {
  MOCK_TIMELINE_ITEMS,
  MOCK_MILESTONES,
  MOCK_TIMELINE_SUMMARY,
} from "@/features/timeline/mocks/timeline.mocks";
import { TimelineViewMode, TimelineZoom } from "@/features/timeline/types/timeline.types";

const GROUPS = [
  { id: "grp-1", name: "Core Engineering" },
  { id: "grp-2", name: "Product & Growth" },
];

const PROJECTS = [
  { id: "proj-1", name: "TaskFi Next.js Web App", groupId: "grp-1" },
  { id: "proj-2", name: "TaskFi Mobile & Native", groupId: "grp-1" },
  { id: "proj-3", name: "Growth Landing & SEO", groupId: "grp-2" },
];

const VIEW_MODE_TABS: SegmentedControlTab[] = [
  { id: "gantt", label: "Gantt Chart", icon: StackIcon },
  { id: "milestones", label: "Milestones", icon: FlagIcon },
];

const ZOOM_TABS: SegmentedControlTab[] = [
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
  { id: "quarter", label: "Quarter" },
];

const TAB_VARIANTS = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.15 } },
};

export function TimelineView() {
  const [selectedGroup, setSelectedGroup] = useState<string>("grp-1");
  const [selectedProject, setSelectedProject] = useState<string>("proj-1");
  const [viewMode, setViewMode] = useState<TimelineViewMode>("gantt");
  const [zoomLevel, setZoomLevel] = useState<TimelineZoom>("month");

  // Filter projects by group
  const availableProjects = useMemo(() => {
    return PROJECTS.filter((p) => p.groupId === selectedGroup);
  }, [selectedGroup]);

  // Handle group change
  const handleGroupChange = (groupId: string) => {
    setSelectedGroup(groupId);
    const firstProj = PROJECTS.find((p) => p.groupId === groupId);
    if (firstProj) {
      setSelectedProject(firstProj.id);
    }
  };

  // Filtered timeline data per project
  const currentItems = useMemo(() => {
    return MOCK_TIMELINE_ITEMS.filter(
      (item) =>
        item.groupId === selectedGroup && item.projectId === selectedProject,
    );
  }, [selectedGroup, selectedProject]);

  const currentMilestones = useMemo(() => {
    return MOCK_MILESTONES.filter(
      (ms) => ms.groupId === selectedGroup && ms.projectId === selectedProject,
    );
  }, [selectedGroup, selectedProject]);

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      {/* Sticky Header with PageHeader */}
      <div className="shrink-0 bg-background/95 backdrop-blur-md border-b border-border/80 z-20 px-4 sm:px-6 md:px-8 py-3.5">
        <PageHeader
          title="Timeline & Roadmap"
          description="Interactive Gantt view of epics, milestones, and sprint schedules."
          actions={
            <Button
              size={ButtonSize.Sm}
              variant={ButtonVariant.Primary}
              className="gap-1.5 text-[12px] shadow-2xs"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              <span>New Epic</span>
            </Button>
          }
        >
          {/* Sub-header Filter & Controls Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            {/* View Mode Segmented Tabs */}
            <SegmentedControl
              tabs={VIEW_MODE_TABS}
              activeTab={viewMode}
              onTabChange={(id) => setViewMode(id as TimelineViewMode)}
            />

            {/* Right Toolbar Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Group Selector */}
              <Select
                value={selectedGroup}
                onChange={(val) => handleGroupChange(val)}
                wrapperClassName="w-[140px] sm:w-[155px]"
              >
                {GROUPS.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </Select>

              {/* Project Selector */}
              <Select
                value={selectedProject}
                onChange={(val) => setSelectedProject(val)}
                wrapperClassName="w-[180px] sm:w-[200px]"
              >
                {availableProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>

              {/* Zoom Selector */}
              <SegmentedControl
                tabs={ZOOM_TABS}
                activeTab={zoomLevel}
                onTabChange={(id) => setZoomLevel(id as TimelineZoom)}
              />
            </div>
          </div>
        </PageHeader>
      </div>

      {/* Main Content Scrollable Area */}
      <div className="flex-1 w-full px-4 sm:px-6 md:px-8 py-4 overflow-y-auto flex flex-col gap-4 relative z-10">
        {/* Metric Summary Cards */}
        <TimelineSummaryCards summary={MOCK_TIMELINE_SUMMARY} />

        {/* View Mode Switching Content */}
        <AnimatePresence mode="wait">
          {viewMode === "gantt" ? (
            <motion.div
              key={`gantt-${selectedGroup}-${selectedProject}`}
              variants={TAB_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col gap-4"
            >
              <TimelineGanttChart items={currentItems} />
              <TimelineMilestoneList milestones={currentMilestones} />
            </motion.div>
          ) : (
            <motion.div
              key={`milestones-${selectedGroup}-${selectedProject}`}
              variants={TAB_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col gap-4"
            >
              <TimelineMilestoneList milestones={currentMilestones} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
