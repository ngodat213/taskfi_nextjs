"use client";

import { useCallback, useMemo, useState } from "react";
import { useEffect } from "react";

import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { PlusIcon, PulseIcon } from "@phosphor-icons/react/dist/ssr";
import { AnimatePresence, Variants, motion } from "framer-motion";

import { PageContainer } from "@/components/layout/page-container";
import {
  Button,
  ButtonSize,
  ButtonVariant,
} from "@/components/ui/actions/button";
import { SegmentedControl } from "@/components/ui/forms/segmented-control";
import { PageHeader } from "@/components/ui/layout/page-header";
import { APP_CONFIG } from "@/config/app.config";
import { TAB_CONTENT_VARIANTS } from "@/constants/animations";
import { TRANSLATION_KEYS } from "@/constants/translations";
import { DashboardArchivedTab } from "@/features/archived/components/dashboard-archived-tab";
import { DashboardBacklogTab } from "@/features/backlog/components/dashboard-backlog-tab";
import { DashboardBoardTab } from "@/features/board/components/dashboard-board-tab";
import { DashboardDepsTab } from "@/features/deps/components/dashboard-deps-tab";
import { DashboardDoneTab } from "@/features/done/components/dashboard-done-tab";
import { IssueDetailView } from "@/features/issue-detail/components/issue-detail-view";
import { DashboardIssuesTab } from "@/features/issues/components/dashboard-issues-tab";
import { DASHBOARD_TABS } from "@/features/issues/constants/issue-ui.constants";
import { useIssues } from "@/features/projects/hooks/use-issues";
import { useProject } from "@/features/projects/hooks/use-project";
import { DashboardRetrosTab } from "@/features/retros/components/dashboard-retros-tab";
import { RetroDetailView } from "@/features/retros/components/retro-detail-view";
import { DashboardWorkloadTab } from "@/features/workload/components/dashboard-workload-tab";
import { GetIssuesParams } from "@/services/issue.service";
import { Issue } from "@/types/issue.types";

import { CreateTaskModal } from "./create-task-modal";
import { DashboardReportsTab } from "./dashboard-reports-tab";
import {
  ArchivedTabFilterBar,
  DepsTabFilterBar,
  IssueTabFilterBar,
  ReportsTabFilterBar,
  RetrosTabFilterBar,
  WorkloadTabFilterBar,
} from "./filters";

const EMPTY_ISSUES: Issue[] = [];

const tabVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 450,
      damping: 28,
    },
  },
};

export function DashboardView({ projectId }: { projectId: string }) {
  const t = useTranslations("Dashboard");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQ(q);
    }, 250);
    return () => clearTimeout(timer);
  }, [q]);

  const [activeTab, setActiveTab] = useState("Board");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalStatus, setCreateModalStatus] = useState<
    string | undefined
  >();
  const [isRetroModalOpen, setIsRetroModalOpen] = useState(false);
  const [isDepModalOpen, setIsDepModalOpen] = useState(false);

  // Retros Contextual Filter State
  const [retrosSprint, setRetrosSprint] = useState<string>("sprint-24");

  const { data: projectResponse } = useProject(projectId);
  const project = projectResponse?.data;
  const selectedIssueId = searchParams.get("issueId");
  const setSelectedIssueId = useCallback(
    (id: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (id) {
        params.set("issueId", id);
      } else {
        params.delete("issueId");
      }
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );

  const selectedRetroId = searchParams.get("retroId");
  const setSelectedRetroId = useCallback(
    (id: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (id) {
        params.set("retroId", id);
      } else {
        params.delete("retroId");
      }
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );

  const [retrosSearch, setRetrosSearch] = useState<string>("");

  // Deps Contextual Filter State
  const [depsViewMode, setDepsViewMode] = useState<"graph" | "list">("graph");
  const [depsFilterRisk, setDepsFilterRisk] = useState<string>("all");
  const [depsSearch, setDepsSearch] = useState<string>("");
  const [depsSelectedStatuses, setDepsSelectedStatuses] = useState<string[]>([
    "to do",
    "in progress",
    "in review",
    "done",
  ]);

  // Archived Contextual Filter State
  const [archivedFilterType, setArchivedFilterType] = useState<string>("all");
  const [archivedSearch, setArchivedSearch] = useState<string>("");

  const [assigneeFilter, setAssigneeFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");

  const issueFilters = useMemo(() => {
    const filters: GetIssuesParams = {
      page: 1,
      limit: APP_CONFIG.PAGINATION.MAX_LIMIT,
      search: debouncedQ || undefined,
    };
    if (assigneeFilter && assigneeFilter !== "all") {
      filters.assigneeId = assigneeFilter;
    }
    if (typeFilter && typeFilter !== "all") {
      filters.type = typeFilter;
    }
    if (priorityFilter && priorityFilter !== "all") {
      filters.priority = priorityFilter;
    }
    return filters;
  }, [debouncedQ, assigneeFilter, typeFilter, priorityFilter]);

  const { data: issuesData, isLoading } = useIssues(projectId, issueFilters);
  const issues = issuesData?.data?.data ?? EMPTY_ISSUES;

  const getHeaderTitle = () => {
    if (project) return project.name;
    if (projectId) return t(TRANSLATION_KEYS.DASHBOARD.loading);
    return t(TRANSLATION_KEYS.DASHBOARD.title);
  };

  const renderHeaderFilterBar = () => {
    const normalizedTab = activeTab.toLowerCase();
    if (["board", "backlog", "issues", "done"].includes(normalizedTab)) {
      return (
        <IssueTabFilterBar
          q={q}
          onSearchChange={setQ}
          assigneeFilter={assigneeFilter}
          onAssigneeChange={setAssigneeFilter}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
        />
      );
    }

    if (normalizedTab === "reports") {
      return <ReportsTabFilterBar />;
    }

    if (normalizedTab === "workload") {
      return <WorkloadTabFilterBar q={q} onSearchChange={setQ} />;
    }

    if (normalizedTab === "retros") {
      return (
        <RetrosTabFilterBar
          selectedSprint={retrosSprint}
          onSprintChange={setRetrosSprint}
          searchQuery={retrosSearch}
          onSearchChange={setRetrosSearch}
        />
      );
    }

    if (normalizedTab === "deps") {
      return (
        <DepsTabFilterBar
          viewMode={depsViewMode}
          onViewModeChange={setDepsViewMode}
          searchQuery={depsSearch}
          onSearchChange={setDepsSearch}
          filterRisk={depsFilterRisk}
          onFilterRiskChange={setDepsFilterRisk}
          selectedStatuses={depsSelectedStatuses}
          onSelectedStatusesChange={setDepsSelectedStatuses}
        />
      );
    }

    if (normalizedTab === "archived") {
      return (
        <ArchivedTabFilterBar
          filterType={archivedFilterType}
          onFilterTypeChange={setArchivedFilterType}
          searchQuery={archivedSearch}
          onSearchChange={setArchivedSearch}
        />
      );
    }

    return null;
  };

  const renderHeaderActions = () => {
    const normalizedTab = activeTab.toLowerCase();
    if (normalizedTab === "retros") {
      return (
        <>
          <Button variant={ButtonVariant.Outline} size={ButtonSize.Sm}>
            <PulseIcon className="w-3.5 h-3.5" strokeWidth={2.5} />{" "}
            {t(TRANSLATION_KEYS.DASHBOARD.standup)}
          </Button>
          <Button
            variant={ButtonVariant.Primary}
            size={ButtonSize.Sm}
            onClick={() => setIsRetroModalOpen(true)}
          >
            <PlusIcon className="w-3.5 h-3.5" strokeWidth={2.5} /> Add Retro
            Note
          </Button>
        </>
      );
    }

    if (normalizedTab === "deps") {
      return (
        <>
          <Button variant={ButtonVariant.Outline} size={ButtonSize.Sm}>
            <PulseIcon className="w-3.5 h-3.5" strokeWidth={2.5} />{" "}
            {t(TRANSLATION_KEYS.DASHBOARD.standup)}
          </Button>
          <Button
            variant={ButtonVariant.Primary}
            size={ButtonSize.Sm}
            onClick={() => setIsDepModalOpen(true)}
          >
            <PlusIcon className="w-3.5 h-3.5" strokeWidth={2.5} /> Add
            Dependency
          </Button>
        </>
      );
    }

    return (
      <>
        <Button variant={ButtonVariant.Outline} size={ButtonSize.Sm}>
          <PulseIcon className="w-3.5 h-3.5" strokeWidth={2.5} />{" "}
          {t(TRANSLATION_KEYS.DASHBOARD.standup)}
        </Button>
        <Button
          variant={ButtonVariant.Primary}
          size={ButtonSize.Sm}
          onClick={() => {
            setCreateModalStatus(undefined);
            setIsCreateModalOpen(true);
          }}
        >
          <PlusIcon className="w-3.5 h-3.5" strokeWidth={2.5} />{" "}
          {t(TRANSLATION_KEYS.DASHBOARD.addTask)}
        </Button>
      </>
    );
  };

  const renderTabContent = () => {
    const normalizedTab = activeTab.toLowerCase();
    switch (normalizedTab) {
      case "board":
        return (
          <DashboardBoardTab
            projectId={projectId}
            workspaceId={project?.workspaceId || ""}
            q={q}
            issues={issues}
            isLoading={isLoading}
            onIssueClick={setSelectedIssueId}
            onAddClick={(status) => {
              setCreateModalStatus(status);
              setIsCreateModalOpen(true);
            }}
          />
        );
      case "backlog":
        return (
          <DashboardBacklogTab
            q={q}
            issues={issues}
            isLoading={isLoading}
            onIssueClick={setSelectedIssueId}
          />
        );
      case "issues":
        return (
          <DashboardIssuesTab
            q={q}
            issues={issues}
            isLoading={isLoading}
            onIssueClick={setSelectedIssueId}
          />
        );
      case "done":
        return (
          <DashboardDoneTab
            q={q}
            issues={issues}
            isLoading={isLoading}
            onIssueClick={setSelectedIssueId}
          />
        );
      case "reports":
        return <DashboardReportsTab projectId={projectId} />;
      case "workload":
        return <DashboardWorkloadTab projectId={projectId} />;
      case "retros":
        return (
          <DashboardRetrosTab
            projectId={projectId}
            isAddModalOpen={isRetroModalOpen}
            onAddModalOpenChange={setIsRetroModalOpen}
            selectedSprint={retrosSprint}
            onSprintChange={setRetrosSprint}
            searchQuery={retrosSearch}
            onSearchQueryChange={setRetrosSearch}
            onRetroClick={setSelectedRetroId}
          />
        );
      case "deps":
        return (
          <DashboardDepsTab
            projectId={projectId}
            viewMode={depsViewMode}
            onViewModeChange={setDepsViewMode}
            filterRisk={depsFilterRisk}
            onFilterRiskChange={setDepsFilterRisk}
            searchQuery={depsSearch}
            onSearchQueryChange={setDepsSearch}
            selectedStatuses={depsSelectedStatuses}
            isAddModalOpen={isDepModalOpen}
            onAddModalOpenChange={setIsDepModalOpen}
            onIssueClick={setSelectedIssueId}
          />
        );
      case "archived":
        return (
          <DashboardArchivedTab
            projectId={projectId}
            filterType={archivedFilterType}
            onFilterTypeChange={setArchivedFilterType}
            searchQuery={archivedSearch}
            onSearchQueryChange={setArchivedSearch}
          />
        );
      default:
        return (
          <div className="flex-1 flex items-center justify-center text-muted-foreground flex-col gap-3">
            <PulseIcon className="w-8 h-8 text-muted-foreground" />
            <p>Content for {activeTab} is coming soon.</p>
          </div>
        );
    }
  };

  return (
    <PageContainer>
      <AnimatePresence mode="popLayout">
        {selectedIssueId ? (
          <motion.div
            key={`issue-detail-${selectedIssueId}`}
            variants={TAB_CONTENT_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full h-full"
          >
            <IssueDetailView
              projectId={projectId}
              issueId={selectedIssueId}
              onClose={() => setSelectedIssueId(null)}
              onIssueSelect={(id) => setSelectedIssueId(id)}
            />
          </motion.div>
        ) : selectedRetroId ? (
          <motion.div
            key={`retro-detail-${selectedRetroId}`}
            variants={TAB_CONTENT_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full h-full"
          >
            <RetroDetailView
              projectId={projectId}
              retroId={selectedRetroId}
              onClose={() => setSelectedRetroId(null)}
            />
          </motion.div>
        ) : (
          <>
            {/* Project Header Area */}
            <div className="bg-transparent border-b border-border/60 shrink-0">
              <div className="w-full px-6 pt-5">
                <PageHeader
                  title={
                    <>
                      {getHeaderTitle()}
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
                  description={t(TRANSLATION_KEYS.DASHBOARD.kanbanFlow)}
                  actions={renderHeaderActions()}
                >
                  <div className="flex flex-col gap-2.5 mb-2">
                    {/* Tabs */}
                    <SegmentedControl
                      tabs={DASHBOARD_TABS}
                      activeTab={activeTab}
                      onTabChange={setActiveTab}
                    />
                    {/* Contextual Filter Bar Tailored Per Active Tab */}
                    {renderHeaderFilterBar()}
                  </div>
                </PageHeader>
              </div>
            </div>

            {/* Tab Content Area */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <motion.div
                key={activeTab}
                variants={tabVariants}
                initial="hidden"
                animate="show"
                className="w-full h-full flex flex-col"
              >
                {renderTabContent()}
              </motion.div>
            </div>

            {/* Create Task Modal */}
            <CreateTaskModal
              projectId={projectId}
              isOpen={isCreateModalOpen}
              onClose={() => setIsCreateModalOpen(false)}
              defaultStatus={createModalStatus}
            />
          </>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}
