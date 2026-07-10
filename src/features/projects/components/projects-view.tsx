"use client";

import { useState } from "react";
import { List, LayoutGrid, Calendar, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { PageHeader } from "@/components/ui/page-header";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Badge } from "@/components/ui/badge";

export function ProjectsView() {
  const [activeTab, setActiveTab] = useState("list");

  const tabs = [
    { id: "list", label: "List", icon: List },
    { id: "cards", label: "Cards", icon: LayoutGrid },
    { id: "calendar", label: "Calendar", icon: Calendar },
  ];

  return (
    <div className="relative flex flex-col h-full bg-[#FCFCFD] overflow-y-auto">
      {/* Subtle Top Mesh Gradient (Mobbin Style) */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-br from-rose-100/50 via-blue-50/30 to-transparent blur-[100px] pointer-events-none -z-10 opacity-70" />
      <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-gradient-to-bl from-indigo-50/50 via-purple-50/20 to-transparent blur-[100px] pointer-events-none -z-10 opacity-70" />

      {/* Main Container - Responsive padding */}
      <div className="flex-1 w-full px-4 sm:px-6 md:px-8 pt-5 pb-6">
        {/* Header Area */}
        <PageHeader
          className="mb-4"
          title="All Projects"
          description="Portfolio, delivery mode, and project membership"
          actions={
            <Button variant="primary" size="sm" className="w-fit">
              New Project
              <ArrowRight className="w-3 h-3" />
            </Button>
          }
        >
          {/* Filters & Tabs Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-0">
            {/* Segmented Control Tabs */}
            <SegmentedControl
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Select wrapperClassName="w-[120px] sm:w-[130px]">
                <option>All groups</option>
              </Select>

              <label className="flex items-center gap-1.5 cursor-pointer group select-none bg-white border border-slate-200 shadow-sm h-8 px-2.5 rounded-md hover:border-slate-300 transition-all">
                <div className="relative w-3.5 h-3.5 rounded-[3px] border border-blue-500 flex items-center justify-center bg-blue-500 flex-shrink-0">
                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                </div>
                <span className="text-[12px] sm:text-[12.5px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors whitespace-nowrap">
                  Group by project
                </span>
              </label>
            </div>
          </div>
        </PageHeader>

        {/* Main Content */}
        <div className="flex flex-col gap-1.5 mt-2 lg:mt-0">
          {/* Group Header */}
          <div className="flex items-center gap-1.5 mb-1 px-0.5">
            <div className="w-5 h-5 rounded flex items-center justify-center bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold text-slate-700">M</span>
            </div>
            <span className="text-[13px] font-semibold text-slate-900 tracking-tight">
              MEBIECO Group
            </span>
            <div className="px-1.5 py-[1px] rounded bg-slate-100 text-slate-500 text-[9px] font-bold uppercase ml-0.5">
              1 Project
            </div>
          </div>

          {/* Table Header (Hidden on small screens) */}
          <div className="hidden md:grid md:grid-cols-[2fr_1fr_1fr] lg:grid-cols-[2fr_1fr_1fr_1fr] px-4 py-1 mb-0.5 gap-4">
            <span className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider">
              Project Name
            </span>
            <span className="hidden lg:block text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider">
              Type
            </span>
            <span className="hidden lg:block text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider">
              Group
            </span>
            <span className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider">
              Members
            </span>
          </div>

          {/* Clean White Rows - Responsive Grid */}
          <div className="flex flex-col gap-2 sm:gap-1.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] lg:grid-cols-[2fr_1fr_1fr_1fr] gap-3 md:gap-4 items-start md:items-center px-4 py-3 sm:py-2.5 bg-white border border-slate-200 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-slate-300 transition-all duration-200 cursor-pointer group"
              >
                {/* Project Name */}
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-8 h-8 rounded-md border border-slate-200 flex items-center justify-center bg-white shadow-sm flex-shrink-0 group-hover:border-blue-200 transition-colors mt-0.5 sm:mt-0">
                    <span className="text-[8px] font-bold text-blue-500 leading-[1.1] text-center">
                      MEBI
                      <br />
                      ECO
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5 sm:gap-0">
                    <span className="text-[13.5px] font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      Mebieco {i > 1 ? `Phase ${i}` : ""}
                    </span>
                    <span className="text-[11.5px] text-slate-500 line-clamp-1">
                      MBECO <span className="mx-1 text-slate-300">•</span>{" "}
                      Mebieco System
                    </span>
                  </div>
                </div>

                {/* Type - Hidden on smaller screens, shown inline later */}
                <div className="hidden lg:flex items-center">
                  <Badge
                    variant="blue"
                    className="text-[10px] uppercase font-semibold"
                  >
                    KANBAN
                  </Badge>
                </div>

                {/* Group - Hidden on smaller screens */}
                <div className="hidden lg:flex items-center">
                  <Badge
                    variant="slate"
                    className="text-[10px] uppercase font-semibold"
                  >
                    MEBIECO
                  </Badge>
                </div>

                {/* Members */}
                <div className="hidden md:flex items-center">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1">
                      <div className="w-5 h-5 rounded-full border-[1.5px] border-white bg-slate-200" />
                      <div className="w-5 h-5 rounded-full border-[1.5px] border-white bg-slate-300" />
                      <div className="w-5 h-5 rounded-full border-[1.5px] border-white bg-slate-400" />
                    </div>
                    <span className="text-[12.5px] text-slate-600 group-hover:text-slate-900 transition-colors">
                      25
                    </span>
                  </div>
                </div>

                {/* Mobile Extra Info (Type, Group, Members inline for small screens) */}
                <div className="flex md:hidden items-center gap-2 flex-wrap pl-11">
                  <Badge
                    variant="blue"
                    className="text-[9.5px] uppercase font-semibold"
                  >
                    KANBAN
                  </Badge>
                  <Badge
                    variant="slate"
                    className="text-[9.5px] uppercase font-semibold"
                  >
                    MEBIECO
                  </Badge>
                  <div className="flex items-center gap-1.5 ml-1">
                    <div className="flex -space-x-1">
                      <div className="w-4 h-4 rounded-full border border-white bg-slate-200" />
                      <div className="w-4 h-4 rounded-full border border-white bg-slate-300" />
                    </div>
                    <span className="text-[11px] text-slate-500">25</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
