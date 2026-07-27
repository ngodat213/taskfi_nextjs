"use client";

import { useState } from "react";
import { EmptyState } from "@/components/ui/data-display/empty-state";
import { KanbanColumn } from "@/components/ui/layout/kanban-column";
import { AddRetroModal } from "./add-retro-modal";
import { RetroCard } from "./retro-card";
import { motion, type Variants } from "framer-motion";
import {
  STAGGER_CONTAINER_VARIANTS,
  SPRING_CARD_VARIANTS,
} from "@/constants/animations";
import { useDashboardRetros } from "@/features/retros/hooks/use-dashboard-retros";
import {
  RETRO_COLUMNS,
  DEFAULT_SPRINT_ID,
} from "@/features/retros/constants/retro.constants";

interface DashboardRetrosTabProps {
  projectId?: string;
  isAddModalOpen?: boolean;
  onAddModalOpenChange?: (open: boolean) => void;
  selectedSprint?: string;
  onSprintChange?: (sprint: string) => void;
  searchQuery?: string;
  onSearchQueryChange?: (q: string) => void;
  onRetroClick?: (retroId: string) => void;
}

const containerVariants: Variants = STAGGER_CONTAINER_VARIANTS;
const columnVariants: Variants = SPRING_CARD_VARIANTS;

export function DashboardRetrosTab({
  projectId,
  isAddModalOpen: externalIsAddModalOpen,
  onAddModalOpenChange,
  selectedSprint = DEFAULT_SPRINT_ID,
  searchQuery = "",
  onRetroClick,
}: DashboardRetrosTabProps = {}) {
  const [internalIsAddModalOpen, setInternalIsAddModalOpen] = useState(false);

  const isAddModalOpen =
    externalIsAddModalOpen !== undefined
      ? externalIsAddModalOpen
      : internalIsAddModalOpen;

  const setIsAddModalOpen = (open: boolean) => {
    setInternalIsAddModalOpen(open);
    onAddModalOpenChange?.(open);
  };

  const { itemsByCategory, handleVote, handleToggleComplete, handleAddNote } =
    useDashboardRetros({ projectId, selectedSprint, searchQuery });

  return (
    <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-4"
      >
        {/* 3 Kanban Columns Grid */}
        <motion.div
          variants={columnVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl"
        >
          {RETRO_COLUMNS.map((col) => {
            const items = itemsByCategory.get(col.category) || [];
            const Icon = col.icon;

            return (
              <KanbanColumn
                key={col.category}
                title={col.title}
                color={col.color}
                count={items.length}
                onAddClick={() => setIsAddModalOpen(true)}
                addTooltip="Add retro note"
                isEmpty={items.length === 0}
                emptyState={
                  <EmptyState
                    icon={Icon}
                    title={col.emptyTitle}
                    className="p-6 bg-card border border-border/80 rounded-xl"
                  />
                }
              >
                {items.map((item) => (
                  <RetroCard
                    key={item.id}
                    item={item}
                    categoryVariant={col.variant}
                    onRetroClick={onRetroClick}
                    onToggleComplete={handleToggleComplete}
                    onVote={handleVote}
                  />
                ))}
              </KanbanColumn>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Add Retro Note Modal */}
      <AddRetroModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddNote={handleAddNote}
      />
    </div>
  );
}
