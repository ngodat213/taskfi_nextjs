"use client";
import { useMemo, useState } from "react";

import {
  CalendarIcon,
  CalendarXIcon,
  CaretDownIcon,
  ChecksIcon,
  MagnifyingGlassIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { AnimatePresence, motion } from "framer-motion";

import { PageContainer } from "@/components/layout/page-container";
import { SegmentedControl } from "@/components/ui/forms/segmented-control";
import { PageHeader } from "@/components/ui/layout/page-header";
import { APP_CONFIG } from "@/config/app.config";
import { TAB_CONTENT_VARIANTS } from "@/constants/animations";
import { useMyTasks } from "@/features/projects/hooks/use-issues";
import { useRouter } from "@/i18n/routing";
import { useWorkspaceStore } from "@/store/workspace.store";
import { Issue } from "@/types/issue.types";

import { MyTasksList } from "./my-tasks-list";

const tabs = [
  { id: "all", label: "All", icon: ChecksIcon },
  { id: "due_today", label: "Due Today", icon: CalendarIcon },
  { id: "overdue", label: "Overdue", icon: WarningCircleIcon },
  { id: "no_due_date", label: "No Due Date", icon: CalendarXIcon },
];

export function MyTasksView() {
  const router = useRouter();
  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId,
  );
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const filters = useMemo(() => {
    return {
      search: searchQuery || undefined,
      limit: APP_CONFIG.PAGINATION.MAX_LIMIT,
    };
  }, [searchQuery]);

  const { data: myTasksRes, isLoading } = useMyTasks(
    activeWorkspaceId,
    filters,
  );
  const tasks = useMemo(
    () => myTasksRes?.data?.data || [],
    [myTasksRes?.data?.data],
  );

  const handleTaskClick = (task: Issue) => {
    if (task.projectId && task.id) {
      router.push(`/projects/${task.projectId}?issueId=${task.id}`);
    }
  };

  return (
    <PageContainer className="font-sans">
      {/* Main Container - Responsive padding */}
      <div className="flex-1 w-full px-4 sm:px-6 md:px-8 pt-5 pb-6">
        {/* Header Area */}
        <PageHeader
          className="mb-4"
          title="My Tasks"
          description="Manage your daily work and assigned tasks"
        >
          {/* Tabs & Filters Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-0">
            <SegmentedControl
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative flex items-center">
                {isSearchOpen ? (
                  <div className="relative flex items-center">
                    <MagnifyingGlassIcon className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 pointer-events-none" />
                    <input
                      type="text"
                      autoFocus
                      placeholder="Search my tasks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onBlur={() => {
                        if (!searchQuery) setIsSearchOpen(false);
                      }}
                      className="h-8 pl-8 pr-3 bg-card border border-border rounded-lg text-[12.5px] font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary w-45 sm:w-55 transition-all shadow-sm"
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="h-8 px-3 flex items-center gap-2 bg-card border border-border rounded-lg text-[12.5px] font-medium text-muted-foreground hover:bg-muted hover:border-border transition-colors shadow-sm whitespace-nowrap"
                  >
                    <MagnifyingGlassIcon className="w-3.5 h-3.5 text-muted-foreground" />{" "}
                    Filter
                  </button>
                )}
              </div>
              <button className="h-8 px-3 flex items-center gap-2 bg-card border border-border rounded-lg text-[12.5px] font-medium text-muted-foreground hover:bg-muted hover:border-border transition-colors shadow-sm whitespace-nowrap">
                Sort{" "}
                <CaretDownIcon className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </PageHeader>

        {/* Content Area */}
        <div className="flex-1 mt-2 lg:mt-0">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeTab}
              variants={TAB_CONTENT_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <MyTasksList
                activeTab={activeTab}
                tasks={tasks}
                isLoading={isLoading}
                onTaskClick={handleTaskClick}
                searchQuery={searchQuery}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </PageContainer>
  );
}
