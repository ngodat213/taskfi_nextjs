"use client";

import { useState, useMemo } from "react";
import { ArchiveIcon, ArrowCounterClockwiseIcon, FileTextIcon, LightningIcon } from "@phosphor-icons/react/dist/ssr";
import { MOCK_ARCHIVED_ITEMS } from "@/features/archived/mocks/archived.mocks";
import { ArchivedItem } from "@/features/archived/types/archived.types";
import { StatCard } from "@/components/ui/data-display/stat-card";
import { EmptyState } from "@/components/ui/data-display/empty-state";
import { KanbanColumn } from "@/components/ui/layout/kanban-column";
import { ArchivedCard } from "./archived-card";

interface DashboardArchivedTabProps {
  projectId: string;
  filterType?: string;
  onFilterTypeChange?: (type: string) => void;
  searchQuery?: string;
  onSearchQueryChange?: (q: string) => void;
}

export function DashboardArchivedTab({
  filterType = "all",
  searchQuery = "",
}: DashboardArchivedTabProps) {
  const [items, setItems] = useState<ArchivedItem[]>(MOCK_ARCHIVED_ITEMS);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesType = filterType === "all" || item.type === filterType;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.reason &&
          item.reason.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesType && matchesSearch;
    });
  }, [items, filterType, searchQuery]);

  const { issueItems, sprintItems, docItems } = useMemo(() => {
    return {
      issueItems: filteredItems.filter((i) => i.type === "issue"),
      sprintItems: filteredItems.filter((i) => i.type === "sprint"),
      docItems: filteredItems.filter((i) => i.type === "document"),
    };
  }, [filteredItems]);

  const handleRestore = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 max-w-5xl">
        <StatCard
          label="Archived Items"
          value={items.length}
          icon={<ArchiveIcon className="w-4.5 h-4.5 text-blue-500" />}
        />
        <StatCard
          label="Restored This Month"
          value={12}
          icon={
            <ArrowCounterClockwiseIcon className="w-4.5 h-4.5 text-emerald-500" />
          }
        />
        <StatCard
          label="Storage Space Saved"
          value="1.4 GB"
          icon={<FileTextIcon className="w-4.5 h-4.5 text-purple-500" />}
        />
      </div>

      {/* 3 Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl">
        {/* Column 1: Archived Issues */}
        <KanbanColumn
          title="Archived Issues"
          color="#3b82f6"
          count={issueItems.length}
          isEmpty={issueItems.length === 0}
          emptyState={
            <EmptyState
              icon={ArchiveIcon}
              title="No archived issues"
              className="p-6 bg-card border border-border/80 rounded-xl"
            />
          }
        >
          {issueItems.map((item) => (
            <ArchivedCard key={item.id} item={item} onRestore={handleRestore} />
          ))}
        </KanbanColumn>

        {/* Column 2: Archived Sprints */}
        <KanbanColumn
          title="Archived Sprints"
          color="#10b981"
          count={sprintItems.length}
          isEmpty={sprintItems.length === 0}
          emptyState={
            <EmptyState
              icon={LightningIcon}
              title="No archived sprints"
              className="p-6 bg-card border border-border/80 rounded-xl"
            />
          }
        >
          {sprintItems.map((item) => (
            <ArchivedCard key={item.id} item={item} onRestore={handleRestore} />
          ))}
        </KanbanColumn>

        {/* Column 3: Archived Documents */}
        <KanbanColumn
          title="Archived Documents"
          color="#a855f7"
          count={docItems.length}
          isEmpty={docItems.length === 0}
          emptyState={
            <EmptyState
              icon={FileTextIcon}
              title="No archived documents"
              className="p-6 bg-card border border-border/80 rounded-xl"
            />
          }
        >
          {docItems.map((item) => (
            <ArchivedCard key={item.id} item={item} onRestore={handleRestore} />
          ))}
        </KanbanColumn>
      </div>
    </div>
  );
}
