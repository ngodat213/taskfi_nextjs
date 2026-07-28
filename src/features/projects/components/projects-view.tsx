"use client";

import { CheckIcon, ArrowRightIcon, CircleNotchIcon, FolderOpenIcon } from "@phosphor-icons/react/dist/ssr";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  Button,
  ButtonVariant,
  ButtonSize,
} from "@/components/ui/actions/button";
import { Select } from "@/components/ui/forms/select";
import { PageHeader } from "@/components/ui/layout/page-header";
import { SegmentedControl } from "@/components/ui/forms/segmented-control";
import { useGroups } from "@/features/workspace-settings/hooks/use-groups";
import { EmptyState } from "@/components/ui/data-display/empty-state";
import { AddNewProjectModal } from "./add-new-project-modal";
import { ProjectGroupSection } from "./project-group-section";
import { PROJECT_VIEW_TABS } from "@/features/projects/constants";
import { useTranslations } from "next-intl";
import { TRANSLATION_KEYS } from "@/constants/translations";

import { Project } from "@/types/project.types";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
};

const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const fadeRightVariants: Variants = {
  hidden: { opacity: 0, x: -16, filter: "blur(4px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const fadeLeftVariants: Variants = {
  hidden: { opacity: 0, x: 16, filter: "blur(4px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export function ProjectsView() {
  const t = useTranslations("Projects");
  const TK = TRANSLATION_KEYS.PROJECTS.allProjects;
  const [activeTab, setActiveTab] = useState("list");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const { data: groupsResponse, isLoading: isLoadingGroups } = useGroups();
  const groups = groupsResponse?.data || [];

  let content = null;
  if (isLoadingGroups) {
    content = (
      <motion.div
        variants={slideUpVariants}
        className="flex items-center justify-center p-8"
      >
        <CircleNotchIcon className="w-5 h-5 animate-spin text-muted-foreground" />
      </motion.div>
    );
  } else if (groups.length === 0) {
    content = (
      <motion.div variants={slideUpVariants} className="py-12">
        <EmptyState
          icon={FolderOpenIcon}
          title={t(TK.noGroupsFound)}
          description={t(TK.noGroupsDesc)}
        />
      </motion.div>
    );
  } else {
    content = groups.map((group) => (
      <motion.div key={group.id} variants={slideUpVariants}>
        <ProjectGroupSection
          group={group}
          onEditProject={(project) => {
            setEditingProject(project);
            setIsModalOpen(true);
          }}
        />
      </motion.div>
    ));
  }

  return (
    <div className="relative flex flex-col h-full bg-background overflow-y-auto overflow-x-hidden">
      {/* Main Container - Responsive padding */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 w-full px-4 sm:px-6 md:px-8 pt-5 pb-6"
      >
        {/* Header Area */}
        <PageHeader
          className="mb-4"
          title={
            <motion.span variants={fadeRightVariants} className="inline-block">
              {t(TK.title)}
            </motion.span>
          }
          description={
            <motion.span variants={fadeRightVariants} className="inline-block">
              {t(TK.description)}
            </motion.span>
          }
          actions={
            <motion.div variants={fadeLeftVariants}>
              <Button
                variant={ButtonVariant.Primary}
                size={ButtonSize.Sm}
                className="w-fit"
                onClick={() => {
                  setEditingProject(null);
                  setIsModalOpen(true);
                }}
              >
                {t(TK.newProject)}
                <ArrowRightIcon className="w-3 h-3" />
              </Button>
            </motion.div>
          }
        >
          {/* Filters & Tabs Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-0 overflow-hidden py-1">
            {/* Segmented Control Tabs */}
            <motion.div variants={fadeRightVariants}>
              <SegmentedControl
                tabs={PROJECT_VIEW_TABS}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </motion.div>

            {/* Filters */}
            <motion.div
              variants={fadeLeftVariants}
              className="flex flex-wrap items-center gap-2.5"
            >
              <Select wrapperClassName="w-[120px] sm:w-[130px]">
                <option value="all">{t(TK.allGroups)}</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </Select>

              <label className="flex items-center gap-1.5 cursor-pointer group select-none bg-card border border-border shadow-sm h-8 px-2.5 rounded-md hover:border-border transition-all">
                <div className="relative w-3.5 h-3.5 rounded-[3px] border border-blue-500 flex items-center justify-center bg-blue-500 shrink-0">
                  <CheckIcon className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                </div>
                <span className="text-[12px] sm:text-[12.5px] font-medium text-muted-foreground group-hover:text-slate-900 transition-colors whitespace-nowrap">
                  {t(TK.groupByProject)}
                </span>
              </label>
            </motion.div>
          </div>
        </PageHeader>

        {/* Main Content */}
        <div className="flex flex-col gap-1.5 mt-2 lg:mt-0">{content}</div>
      </motion.div>

      <AddNewProjectModal
        isOpen={isModalOpen}
        projectToEdit={editingProject}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(null);
        }}
      />
    </div>
  );
}
