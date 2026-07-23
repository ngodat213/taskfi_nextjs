"use client";
import { Plus, MagnifyingGlass, Pulse } from "@phosphor-icons/react/dist/ssr";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/ui/layout/page-header";
import { Select } from "@/components/ui/forms/select";
import { SegmentedControl } from "@/components/ui/forms/segmented-control";
import {
  Button,
  ButtonVariant,
  ButtonSize,
} from "@/components/ui/actions/button";
import { Input } from "@/components/ui/forms/input";
import { DashboardBoardTab } from "./dashboard-board-tab";
import { DashboardBacklogTab } from "./dashboard-backlog-tab";
import { DashboardIssuesTab } from "./dashboard-issues-tab";
import { DashboardDoneTab } from "./dashboard-done-tab";
import { PageContainer } from "@/components/layout/page-container";
import { APP_CONFIG } from "@/config/app.config";
import { CreateTaskModal } from "./create-task-modal";
import { DASHBOARD_TABS } from "@/features/dashboard/constants/issue-ui.constants";
import { IssueDetailView } from "@/features/issue-detail/components/issue-detail-view";

import { useProject } from "@/features/projects/hooks/use-project";
import { useIssues } from "@/features/projects/hooks/use-issues";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { TRANSLATION_KEYS } from "@/constants/translations";
import { TAB_CONTENT_VARIANTS } from "@/constants/animations";
import { IssueType, IssuePriority } from "@/types/issue.types";
import { GetIssuesParams } from "@/services/issue.service";

export function DashboardView({ projectId }: { projectId: string }) {
  const t = useTranslations("Dashboard");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [q, setQ] = useState("");
  const [activeTab, setActiveTab] = useState("Board");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalStatus, setCreateModalStatus] = useState<
    string | undefined
  >();

  const selectedIssueId = searchParams.get("issueId");
  const setSelectedIssueId = (id: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id) {
      params.set("issueId", id);
    } else {
      params.delete("issueId");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };
  const [assigneeFilter, setAssigneeFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");

  const { data: projectResponse } = useProject(projectId);
  const project = projectResponse?.data;

  const issueFilters = useMemo(() => {
    const filters: GetIssuesParams = {
      page: 1,
      limit: APP_CONFIG.PAGINATION.MAX_LIMIT,
      search: q,
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
  }, [q, assigneeFilter, typeFilter, priorityFilter]);

  const { data: issuesData, isLoading } = useIssues(projectId, issueFilters);

  const issues = issuesData?.data?.data || [];

  const getHeaderTitle = () => {
    if (project) return project.name;
    if (projectId) return t(TRANSLATION_KEYS.DASHBOARD.loading);
    return t(TRANSLATION_KEYS.DASHBOARD.title);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Board":
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
      case "Backlog":
        return (
          <DashboardBacklogTab
            q={q}
            issues={issues}
            isLoading={isLoading}
            onIssueClick={setSelectedIssueId}
          />
        );
      case "Issues":
        return (
          <DashboardIssuesTab
            q={q}
            issues={issues}
            isLoading={isLoading}
            onIssueClick={setSelectedIssueId}
          />
        );
      case "Done":
        return (
          <DashboardDoneTab
            q={q}
            issues={issues}
            isLoading={isLoading}
            onIssueClick={setSelectedIssueId}
          />
        );
      default:
        return (
          <div className="flex-1 flex items-center justify-center text-muted-foreground flex-col gap-3">
            <Pulse className="w-8 h-8 text-muted-foreground" />
            <p>Content for {activeTab} is coming soon.</p>
          </div>
        );
    }
  };

  return (
    <PageContainer>
      {selectedIssueId ? (
        <IssueDetailView
          projectId={projectId}
          issueId={selectedIssueId}
          onClose={() => setSelectedIssueId(null)}
        />
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
                actions={
                  <>
                    <Button
                      variant={ButtonVariant.Outline}
                      size={ButtonSize.Sm}
                    >
                      <Pulse className="w-3.5 h-3.5" strokeWidth={2.5} />{" "}
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
                      <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />{" "}
                      {t(TRANSLATION_KEYS.DASHBOARD.addTask)}
                    </Button>
                  </>
                }
              >
                <div className="flex flex-col gap-4 mb-3">
                  {/* Tabs */}
                  <SegmentedControl
                    tabs={DASHBOARD_TABS}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                  />
                  {/* Filter Bar */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                      <MagnifyingGlass className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        type="text"
                        placeholder={t(
                          TRANSLATION_KEYS.DASHBOARD.searchPlaceholder,
                        )}
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        className="w-60 h-8 pl-8 pr-3 text-[12.5px]"
                      />
                    </div>

                    <Select
                      value={assigneeFilter || "Assignee"}
                      onChange={(val) =>
                        setAssigneeFilter(val === "Assignee" ? "" : val)
                      }
                      wrapperClassName="w-fit min-w-[130px]"
                      className="h-8 text-[12.5px] rounded-lg border-border text-muted-foreground font-medium hover:bg-muted hover:border-border shadow-sm gap-2"
                    >
                      <option value="Assignee" disabled hidden>
                        {t("filters.Assignee" as Parameters<typeof t>[0])}
                      </option>
                      <option value="all">
                        {t(TRANSLATION_KEYS.DASHBOARD.filters.all, {
                          filter: t(
                            "filters.Assignee" as Parameters<typeof t>[0],
                          ),
                        })}
                      </option>
                      <option value="unassigned">Unassigned</option>
                    </Select>

                    <Select
                      value={typeFilter || "Type"}
                      onChange={(val) =>
                        setTypeFilter(val === "Type" ? "" : val)
                      }
                      wrapperClassName="w-fit min-w-[130px]"
                      className="h-8 text-[12.5px] rounded-lg border-border text-muted-foreground font-medium hover:bg-muted hover:border-border shadow-sm gap-2"
                    >
                      <option value="Type" disabled hidden>
                        {t("filters.Type" as Parameters<typeof t>[0])}
                      </option>
                      <option value="all">
                        {t(TRANSLATION_KEYS.DASHBOARD.filters.all, {
                          filter: t("filters.Type" as Parameters<typeof t>[0]),
                        })}
                      </option>
                      {Object.values(IssueType).map((type) => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </Select>

                    <Select
                      value={priorityFilter || "Priority"}
                      onChange={(val) =>
                        setPriorityFilter(val === "Priority" ? "" : val)
                      }
                      wrapperClassName="w-fit min-w-[130px]"
                      className="h-8 text-[12.5px] rounded-lg border-border text-muted-foreground font-medium hover:bg-muted hover:border-border shadow-sm gap-2"
                    >
                      <option value="Priority" disabled hidden>
                        {t("filters.Priority" as Parameters<typeof t>[0])}
                      </option>
                      <option value="all">
                        {t(TRANSLATION_KEYS.DASHBOARD.filters.all, {
                          filter: t(
                            "filters.Priority" as Parameters<typeof t>[0],
                          ),
                        })}
                      </option>
                      {Object.values(IssuePriority).map((priority) => (
                        <option key={priority} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
              </PageHeader>
            </div>
          </div>

          {/* Tab Content Area */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={activeTab}
                variants={TAB_CONTENT_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full h-full flex flex-col"
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          <CreateTaskModal
            isOpen={isCreateModalOpen}
            onClose={() => {
              setIsCreateModalOpen(false);
              setCreateModalStatus(undefined);
            }}
            projectId={projectId}
            defaultStatus={createModalStatus}
          />
        </>
      )}
    </PageContainer>
  );
}
