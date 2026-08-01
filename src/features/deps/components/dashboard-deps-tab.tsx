"use client";

import { useMemo, useState } from "react";

import {
  ArrowRightIcon,
  CheckCircleIcon,
  GitForkIcon,
  LinkBreakIcon,
  PulseIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { type Variants, motion } from "framer-motion";

import {
  Button,
  ButtonSize,
  ButtonVariant,
} from "@/components/ui/actions/button";
import { Avatar } from "@/components/ui/data-display/avatar";
import { Badge } from "@/components/ui/data-display/badge";
import { EmptyState } from "@/components/ui/data-display/empty-state";
import { Input } from "@/components/ui/forms/input";
import { Select } from "@/components/ui/forms/select";
import { Modal, ModalContent, ModalHeader } from "@/components/ui/layout/modal";
import { APP_CONFIG } from "@/config/app.config";
import { SPRING_CARD_VARIANTS } from "@/constants/animations";
import {
  DependencyItem,
  DependencyRiskLevel,
} from "@/features/deps/types/deps.types";
import {
  isStatusSelected,
  mapIssuesToDependencies,
} from "@/features/deps/utils/deps.utils";
import { useIssues } from "@/features/projects/hooks/use-issues";
import { Issue } from "@/types/issue.types";

import { DependencyNodeGraph } from "./dependency-node-graph";

const depCardVariants: Variants = SPRING_CARD_VARIANTS;

interface DashboardDepsTabProps {
  projectId: string;
  viewMode?: "graph" | "list";
  onViewModeChange?: (mode: "graph" | "list") => void;
  filterRisk?: string;
  onFilterRiskChange?: (risk: string) => void;
  searchQuery?: string;
  onSearchQueryChange?: (q: string) => void;
  selectedStatuses?: string[];
  isAddModalOpen?: boolean;
  onAddModalOpenChange?: (open: boolean) => void;
  onIssueClick?: (issueId: string) => void;
}

export function DashboardDepsTab({
  projectId,
  viewMode = "graph",
  filterRisk = "all",
  searchQuery = "",
  selectedStatuses,
  isAddModalOpen: externalIsAddModalOpen,
  onAddModalOpenChange,
  onIssueClick,
}: DashboardDepsTabProps) {
  const { data: issuesResponse } = useIssues(projectId || "", {
    limit: APP_CONFIG.PAGINATION.MAX_LIMIT,
  });
  const realIssues: Issue[] = useMemo(
    () => issuesResponse?.data?.data || [],
    [issuesResponse],
  );

  const realDependencies = useMemo(
    () => mapIssuesToDependencies(realIssues),
    [realIssues],
  );

  const [createdDependencies, setCreatedDependencies] = useState<
    DependencyItem[]
  >([]);
  const [internalIsAddModalOpen, setInternalIsAddModalOpen] = useState(false);

  const isAddModalOpen =
    externalIsAddModalOpen !== undefined
      ? externalIsAddModalOpen
      : internalIsAddModalOpen;

  const setIsAddModalOpen = (open: boolean) => {
    setInternalIsAddModalOpen(open);
    onAddModalOpenChange?.(open);
  };

  // Form State
  const [sourceKey, setSourceKey] = useState("TSK-150");
  const [sourceTitle, setSourceTitle] = useState("");
  const [targetKey, setTargetKey] = useState("TSK-151");
  const [targetTitle, setTargetTitle] = useState("");
  const [riskLevel, setRiskLevel] = useState<DependencyRiskLevel>("critical");

  const allDependencies = useMemo(
    () => [...createdDependencies, ...realDependencies],
    [createdDependencies, realDependencies],
  );

  const filteredDeps = useMemo(() => {
    return allDependencies.filter((dep) => {
      const matchesRisk = filterRisk === "all" || dep.riskLevel === filterRisk;
      const matchesSearch =
        dep.sourceIssueSummary
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        dep.targetIssueSummary
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        dep.sourceIssueKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dep.targetIssueKey.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = !selectedStatuses
        ? true
        : selectedStatuses.length === 0
          ? false
          : isStatusSelected(dep.sourceStatus, selectedStatuses) ||
            isStatusSelected(dep.targetStatus, selectedStatuses);

      return matchesRisk && matchesSearch && matchesStatus;
    });
  }, [allDependencies, filterRisk, searchQuery, selectedStatuses]);

  const handleAddDependency = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceTitle.trim() || !targetTitle.trim()) return;

    const newDep: DependencyItem = {
      id: `dep-${Date.now()}`,
      sourceIssueKey: sourceKey.trim() || "TSK-NEW",
      sourceIssueSummary: sourceTitle.trim(),
      sourceAssigneeName: "Chưa phân công",
      sourceAssigneeAvatar: undefined,
      sourceStatus: "In Progress",

      targetIssueKey: targetKey.trim() || "TSK-NEXT",
      targetIssueSummary: targetTitle.trim(),
      targetAssigneeName: "Chưa phân công",
      targetAssigneeAvatar: undefined,
      targetStatus: "Todo",

      type: "blocks",
      riskLevel: riskLevel,
      updatedAt: "Just now",
    };

    setCreatedDependencies([newDep, ...createdDependencies]);
    setSourceTitle("");
    setTargetTitle("");
    setIsAddModalOpen(false);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Done":
        return "emerald";
      case "In Progress":
        return "blue";
      case "In Review":
        return "purple";
      default:
        return "slate";
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
      {/* VIEW MODE 1: VISUAL INTERACTIVE NODE GRAPH */}
      {viewMode === "graph" && (
        <DependencyNodeGraph
          projectId={projectId}
          selectedStatuses={selectedStatuses}
          onIssueClick={onIssueClick}
        />
      )}

      {/* VIEW MODE 2: LIST MATRIX CARDS */}
      {viewMode === "list" && (
        <div className="flex flex-col gap-2.5 w-full max-w-5xl">
          {filteredDeps.length === 0 ? (
            <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-2xs">
              <EmptyState
                icon={LinkBreakIcon}
                title="No dependencies match your filter"
                description="Try searching with another keyword or change your filter tab."
              />
            </div>
          ) : (
            filteredDeps.map((dep) => (
              <motion.div
                key={dep.id}
                layout
                variants={depCardVariants}
                whileHover={{ y: -2, scale: 1.008 }}
                whileTap={{ scale: 0.985 }}
                transition={{ type: "spring", stiffness: 380, damping: 24 }}
                className="bg-card border border-border/80 hover:border-primary/50 rounded-xl p-3.5 shadow-2xs hover:shadow-md transition-all duration-200 backdrop-blur-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5 group select-none overflow-hidden"
              >
                {/* Left Side: Upstream / Blocker Task */}
                <div
                  onClick={() =>
                    dep.sourceIssueId && onIssueClick?.(dep.sourceIssueId)
                  }
                  className="flex-1 min-w-0 bg-secondary/30 border border-border/50 hover:border-primary/40 rounded-lg p-2.5 flex flex-col gap-1.5 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10.5px] font-semibold text-muted-foreground uppercase tracking-wider truncate">
                      Task Cần Xong Trước (Blocker)
                    </span>
                    <Badge variant={getStatusBadgeVariant(dep.sourceStatus)}>
                      {dep.sourceStatus}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 min-w-0">
                    <span className="px-1.5 py-0.5 rounded text-[10.5px] font-semibold bg-secondary text-foreground border border-border shrink-0">
                      {dep.sourceIssueKey}
                    </span>
                    <h4 className="text-[12.5px] font-semibold text-foreground truncate">
                      {dep.sourceIssueSummary}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium pt-1 border-t border-border/40 min-w-0 truncate">
                    <Avatar
                      src={dep.sourceAssigneeAvatar}
                      alt={dep.sourceAssigneeName}
                      size="sm"
                      className="w-4 h-4 shrink-0"
                    />
                    <span className="truncate">
                      Assignee:{" "}
                      <strong className="text-foreground font-semibold">
                        {dep.sourceAssigneeName}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Center Link Arrow Indicator */}
                <div className="flex flex-col items-center justify-center gap-1 shrink-0 py-1 lg:py-0">
                  <div className="flex items-center gap-1.5 text-[11.5px] font-semibold">
                    {dep.riskLevel === "critical" && (
                      <Badge variant="red" dot>
                        <WarningCircleIcon className="w-3.5 h-3.5 text-rose-500" />
                        <span>Critical Blocker</span>
                      </Badge>
                    )}
                    {dep.riskLevel === "warning" && (
                      <Badge variant="amber" dot>
                        <PulseIcon className="w-3.5 h-3.5 text-amber-500" />
                        <span>In Progress</span>
                      </Badge>
                    )}
                    {dep.riskLevel === "resolved" && (
                      <Badge variant="emerald" dot>
                        <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Unblocked / Ready</span>
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-muted-foreground mt-0.5">
                    <span className="text-[10.5px] font-medium">Blocks</span>
                    <ArrowRightIcon className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                </div>

                {/* Right Side: Downstream / Blocked Task */}
                <div
                  onClick={() =>
                    dep.targetIssueId && onIssueClick?.(dep.targetIssueId)
                  }
                  className="flex-1 min-w-0 bg-secondary/30 border border-border/50 hover:border-primary/40 rounded-lg p-2.5 flex flex-col gap-1.5 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10.5px] font-semibold text-muted-foreground uppercase tracking-wider truncate">
                      Task Đang Phụ Thuộc (Blocked)
                    </span>
                    <Badge variant={getStatusBadgeVariant(dep.targetStatus)}>
                      {dep.targetStatus}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 min-w-0">
                    <span className="px-1.5 py-0.5 rounded text-[10.5px] font-semibold bg-secondary text-foreground border border-border shrink-0">
                      {dep.targetIssueKey}
                    </span>
                    <h4 className="text-[12.5px] font-semibold text-foreground truncate">
                      {dep.targetIssueSummary}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium pt-1 border-t border-border/40 min-w-0 truncate">
                    <Avatar
                      src={dep.targetAssigneeAvatar}
                      alt={dep.targetAssigneeName}
                      size="sm"
                      className="w-4 h-4 shrink-0"
                    />
                    <span className="truncate">
                      Assignee:{" "}
                      <strong className="text-foreground font-semibold">
                        {dep.targetAssigneeName}
                      </strong>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Add Dependency Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <ModalContent maxWidth="max-w-md" className="p-5 flex flex-col gap-4">
          <ModalHeader
            title="Add Issue Dependency"
            icon={<GitForkIcon className="w-4 h-4 text-blue-500" />}
          />

          <form
            onSubmit={handleAddDependency}
            className="flex flex-col gap-3.5"
          >
            {/* Source Task (Blocker) */}
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-foreground">
                Blocking Task (Cần xong trước):
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Key (e.g. TSK-104)"
                  value={sourceKey}
                  onChange={(e) => setSourceKey(e.target.value)}
                  className="w-28 h-8 text-[12px] rounded-lg"
                />
                <Input
                  type="text"
                  placeholder="Title of upstream task..."
                  value={sourceTitle}
                  onChange={(e) => setSourceTitle(e.target.value)}
                  required
                  className="flex-1 h-8 text-[12px] rounded-lg"
                />
              </div>
            </div>

            {/* Target Task (Blocked) */}
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-foreground">
                Blocked Task (Đang bị nghẽn):
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Key (e.g. TSK-120)"
                  value={targetKey}
                  onChange={(e) => setTargetKey(e.target.value)}
                  className="w-28 h-8 text-[12px] rounded-lg"
                />
                <Input
                  type="text"
                  placeholder="Title of downstream task..."
                  value={targetTitle}
                  onChange={(e) => setTargetTitle(e.target.value)}
                  required
                  className="flex-1 h-8 text-[12px] rounded-lg"
                />
              </div>
            </div>

            {/* Risk Level Select */}
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-foreground">
                Dependency Risk Level:
              </label>
              <Select
                value={riskLevel}
                onChange={(val) => setRiskLevel(val as DependencyRiskLevel)}
                className="h-8 text-[12px] font-medium rounded-lg"
              >
                <option value="critical">Critical (Blocking execution)</option>
                <option value="warning">Warning (In Progress)</option>
                <option value="resolved">
                  Resolved (Completed / Unblocked)
                </option>
              </Select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
              <Button
                type="button"
                variant={ButtonVariant.Outline}
                size={ButtonSize.Sm}
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg text-[12px] h-8"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant={ButtonVariant.Primary}
                size={ButtonSize.Sm}
                className="rounded-lg text-[12px] h-8"
              >
                Create Dependency
              </Button>
            </div>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
}
