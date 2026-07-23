"use client";
import {
  Plus,
  MagnifyingGlass,
  CaretDown,
  Checks,
  Calendar,
  WarningCircle,
  CalendarX,
} from "@phosphor-icons/react/dist/ssr";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Button,
  ButtonVariant,
  ButtonSize,
} from "@/components/ui/actions/button";
import { TAB_CONTENT_VARIANTS } from "@/constants/animations";
import { PageHeader } from "@/components/ui/layout/page-header";
import { SegmentedControl } from "@/components/ui/forms/segmented-control";
import { MyTasksList } from "./my-tasks-list";
import { AddTaskModal } from "./add-task-modal";
import { PageContainer } from "@/components/layout/page-container";

const tabs = [
  { id: "all", label: "All", icon: Checks },
  { id: "due_today", label: "Due Today", icon: Calendar },
  { id: "overdue", label: "Overdue", icon: WarningCircle },
  { id: "no_due_date", label: "No Due Date", icon: CalendarX },
];

export function MyTasksView() {
  const [activeTab, setActiveTab] = useState("all");
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  return (
    <PageContainer className="font-sans">
      {/* Main Container - Responsive padding */}
      <div className="flex-1 w-full px-4 sm:px-6 md:px-8 pt-5 pb-6">
        {/* Header Area */}
        <PageHeader
          className="mb-4"
          title="My Tasks"
          description="Manage your daily work"
          actions={
            <Button
              variant={ButtonVariant.Primary}
              size={ButtonSize.Sm}
              className="w-fit"
              onClick={() => setIsAddTaskModalOpen(true)}
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={2.5} /> Add Task
            </Button>
          }
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
              <button className="h-8 px-3 flex items-center gap-2 bg-card border border-border rounded-lg text-[12.5px] font-medium text-muted-foreground hover:bg-muted hover:border-border transition-colors shadow-sm whitespace-nowrap">
                <MagnifyingGlass className="w-3.5 h-3.5 text-muted-foreground" />{" "}
                Filter
              </button>
              <button className="h-8 px-3 flex items-center gap-2 bg-card border border-border rounded-lg text-[12.5px] font-medium text-muted-foreground hover:bg-muted hover:border-border transition-colors shadow-sm whitespace-nowrap">
                Sort <CaretDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              <button className="h-8 px-3 flex items-center gap-2 bg-card border border-border rounded-lg text-[12.5px] font-medium text-muted-foreground hover:bg-muted hover:border-border transition-colors shadow-sm whitespace-nowrap">
                Customize{" "}
                <CaretDown className="w-3.5 h-3.5 text-muted-foreground" />
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
              <MyTasksList activeTab={activeTab} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
      />
    </PageContainer>
  );
}
