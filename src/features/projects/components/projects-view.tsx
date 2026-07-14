"use client";

import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import {
  Button,
  ButtonVariant,
  ButtonSize,
} from "@/components/ui/actions/button";
import { Select } from "@/components/ui/forms/select";
import { PageHeader } from "@/components/ui/layout/page-header";
import { SegmentedControl } from "@/components/ui/forms/segmented-control";
import { useGroups } from "@/features/groups/hooks/use-groups";
import { Loader2, FolderOpen } from "lucide-react";
import { EmptyState } from "@/components/ui/data-display/empty-state";
import { AddNewProjectModal } from "./add-new-project-modal";
import { ProjectGroupSection } from "./project-group-section";
import { PROJECT_VIEW_TABS } from "@/features/projects/constants";
import { useTranslations } from "next-intl";
import { TRANSLATION_KEYS } from "@/constants/translations";

export function ProjectsView() {
  const t = useTranslations("Projects");
  const TK = TRANSLATION_KEYS.PROJECTS.allProjects;
  const [activeTab, setActiveTab] = useState("list");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: groupsResponse, isLoading: isLoadingGroups } = useGroups();
  const groups = groupsResponse?.data || [];

  return (
    <div className="relative flex flex-col h-full bg-[#FCFCFD] overflow-y-auto">
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-br from-rose-100/50 via-blue-50/30 to-transparent blur-[100px] pointer-events-none -z-10 opacity-70" />
      <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-gradient-to-bl from-indigo-50/50 via-purple-50/20 to-transparent blur-[100px] pointer-events-none -z-10 opacity-70" />

      {/* Main Container - Responsive padding */}
      <div className="flex-1 w-full px-4 sm:px-6 md:px-8 pt-5 pb-6">
        {/* Header Area */}
        <PageHeader
          className="mb-4"
          title={t(TK.title)}
          description={t(TK.description)}
          actions={
            <Button
              variant={ButtonVariant.Primary}
              size={ButtonSize.Sm}
              className="w-fit"
              onClick={() => setIsModalOpen(true)}
            >
              {t(TK.newProject)}
              <ArrowRight className="w-3 h-3" />
            </Button>
          }
        >
          {/* Filters & Tabs Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-0">
            {/* Segmented Control Tabs */}
            <SegmentedControl
              tabs={PROJECT_VIEW_TABS}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Select wrapperClassName="w-[120px] sm:w-[130px]">
                <option value="all">{t(TK.allGroups)}</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </Select>

              <label className="flex items-center gap-1.5 cursor-pointer group select-none bg-white border border-slate-200 shadow-sm h-8 px-2.5 rounded-md hover:border-slate-300 transition-all">
                <div className="relative w-3.5 h-3.5 rounded-[3px] border border-blue-500 flex items-center justify-center bg-blue-500 flex-shrink-0">
                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                </div>
                <span className="text-[12px] sm:text-[12.5px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors whitespace-nowrap">
                  {t(TK.groupByProject)}
                </span>
              </label>
            </div>
          </div>
        </PageHeader>

        {/* Main Content */}
        <div className="flex flex-col gap-1.5 mt-2 lg:mt-0">
          {isLoadingGroups ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
            </div>
          ) : groups.length === 0 ? (
            <div className="py-12">
              <EmptyState
                icon={FolderOpen}
                title={t(TK.noGroupsFound)}
                description={t(TK.noGroupsDesc)}
              />
            </div>
          ) : (
            groups.map((group) => (
              <ProjectGroupSection key={group.id} group={group} />
            ))
          )}
        </div>
      </div>

      <AddNewProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
