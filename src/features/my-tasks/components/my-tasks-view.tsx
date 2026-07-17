"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  ChevronDown,
  ListTodo,
  CalendarDays,
  AlertCircle,
  CalendarOff,
} from "lucide-react";

import { Button, ButtonVariant, ButtonSize } from "@/components/ui/actions/button";
import { PageHeader } from "@/components/ui/layout/page-header";
import { SegmentedControl } from "@/components/ui/forms/segmented-control";
import { MyTasksList } from "./my-tasks-list";
import { AddTaskModal } from "./add-task-modal";
import { PageContainer } from "@/components/layout/page-container";

const tabs = [
  { id: "all", label: "All", icon: ListTodo },
  { id: "due_today", label: "Due Today", icon: CalendarDays },
  { id: "overdue", label: "Overdue", icon: AlertCircle },
  { id: "no_due_date", label: "No Due Date", icon: CalendarOff },
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
                <Search className="w-3.5 h-3.5 text-muted-foreground" /> Filter
              </button>
              <button className="h-8 px-3 flex items-center gap-2 bg-card border border-border rounded-lg text-[12.5px] font-medium text-muted-foreground hover:bg-muted hover:border-border transition-colors shadow-sm whitespace-nowrap">
                Sort <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              <button className="h-8 px-3 flex items-center gap-2 bg-card border border-border rounded-lg text-[12.5px] font-medium text-muted-foreground hover:bg-muted hover:border-border transition-colors shadow-sm whitespace-nowrap">
                Customize <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </PageHeader>

        {/* Content Area */}
        <div className="flex-1 mt-2 lg:mt-0">
          <MyTasksList activeTab={activeTab} />
        </div>
      </div>

      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
      />
    </PageContainer>
  );
}
