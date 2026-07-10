"use client";

import { useState } from "react";
import { Plus, Search, Activity } from "lucide-react";
import { tabs } from "./mock-data";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardBoardTab } from "./dashboard-board-tab";
import { DashboardBacklogTab } from "./dashboard-backlog-tab";
import { DashboardIssuesTab } from "./dashboard-issues-tab";
import { DashboardDoneTab } from "./dashboard-done-tab";

export function DashboardView() {
  const [q, setQ] = useState("");
  const [activeTab, setActiveTab] = useState("Board");

  const segmentedTabs = tabs.map((t) => ({
    id: t.label,
    label: t.label,
    icon: t.icon,
  }));

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA]">
      {/* Project Header Area */}
      <div className="bg-white border-b border-slate-200/80 flex-shrink-0 flex justify-center">
        <div className="w-full max-w-[1500px] px-6 pt-5">
          <PageHeader
            title={
              <>
                Mebieco
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium border border-orange-200 bg-orange-50 text-orange-600">
                    Kanban
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium border border-emerald-200 bg-emerald-50 text-emerald-600">
                    ND
                  </span>
                </div>
              </>
            }
            description="Kanban flow"
            actions={
              <>
                <Button variant="outline" size="sm">
                  <Activity className="w-3.5 h-3.5" strokeWidth={2.5} /> Standup
                </Button>
                <Button variant="primary" size="sm">
                  <Plus className="w-3.5 h-3.5" strokeWidth={2.5} /> Add Task
                </Button>
              </>
            }
          >
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-3">
              {/* Tabs */}
              <SegmentedControl
                tabs={segmentedTabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
              {/* Filter Bar */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    type="text"
                    placeholder="Search title or TEST-1..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="w-[240px] h-8 pl-8 pr-3 text-[12.5px]"
                  />
                </div>

                {["Assignee", "Type", "Priority"].map((filter) => (
                  <Select
                    key={filter}
                    defaultValue={filter}
                    wrapperClassName="w-fit"
                    className="h-8 text-[12.5px] rounded-lg border-slate-200 text-slate-600 font-medium hover:bg-slate-50 hover:border-slate-300 shadow-sm gap-2"
                  >
                    <option value={filter} disabled hidden>
                      {filter}
                    </option>
                    <option value="all">All {filter}s</option>
                    <option value="mine">My {filter}s</option>
                  </Select>
                ))}
              </div>
            </div>
          </PageHeader>
        </div>
      </div>

      {/* Tab Content Area */}
      <div className="flex-1 flex justify-center overflow-hidden">
        <div className="w-full max-w-[1500px] h-full flex flex-col">
          {activeTab === "Board" ? (
            <DashboardBoardTab q={q} />
          ) : activeTab === "Backlog" ? (
            <DashboardBacklogTab q={q} />
          ) : activeTab === "Issues" ? (
            <DashboardIssuesTab q={q} />
          ) : activeTab === "Done" ? (
            <DashboardDoneTab q={q} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 flex-col gap-3">
              <Activity className="w-8 h-8 text-slate-300" />
              <p>Content for {activeTab} is coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
