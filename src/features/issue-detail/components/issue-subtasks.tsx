import { useState } from "react";
import { useTranslations } from "next-intl";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { TRANSLATION_KEYS } from "@/constants/translations";
import {
  useIssueChildren,
  useChildOptions,
  useUpdateIssue,
} from "@/features/projects/hooks/use-issues";
import { mapIssueToSearchOption } from "@/features/issue-detail/utils/issue-options.utils";
import { EmptyState } from "@/components/ui/data-display/empty-state";
import { SearchSelect } from "@/components/ui/forms/search-select";
import { ErrorTooltip } from "@/components/ui/feedback/error-tooltip";
import { useAutoError } from "@/hooks/use-auto-error";
import { IssueItemCard } from "@/features/issue-detail/components/issue-item-card";
import { CreateTaskModal } from "@/features/dashboard/components/create-task-modal";
import { motion, AnimatePresence } from "framer-motion";
import {
  STAGGER_CONTAINER_VARIANTS,
  SPRING_CARD_VARIANTS,
} from "@/constants/animations";

interface IssueSubtasksProps {
  projectId: string;
  parentId: string;
  onIssueSelect?: (issueId: string) => void;
}

export function IssueSubtasks({
  projectId,
  parentId,
  onIssueSelect,
}: IssueSubtasksProps) {
  const t = useTranslations("Dashboard");
  const TK = TRANSLATION_KEYS.DASHBOARD.IssueSubtasks;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { fieldErrors, handleApiError, clearFieldError } = useAutoError();

  const updateIssue = useUpdateIssue();
  const { data: childOptionsResponse } = useChildOptions(projectId, {
    search: searchQuery || undefined,
  });
  const allIssues = childOptionsResponse?.data || [];

  const { data: childrenResponse, isLoading: isLoadingChildren } =
    useIssueChildren(projectId, parentId);
  const subtasks = childrenResponse?.data || [];

  const searchOptions = allIssues
    .filter((i) => i.id !== parentId)
    .map(mapIssueToSearchOption);

  const handleAddSubtask = (issueId: string) => {
    if (!issueId) return;
    clearFieldError("subtask");
    updateIssue.mutate(
      {
        projectId,
        issueId,
        data: { parentId },
      },
      {
        onError: (err) => handleApiError(err, "subtask"),
      },
    );
  };

  const handleRemoveSubtask = (issueId: string) => {
    clearFieldError("subtask");
    updateIssue.mutate(
      {
        projectId,
        issueId,
        data: { parentId: null },
      },
      {
        onError: (err) => handleApiError(err, "subtask"),
      },
    );
  };

  return (
    <div className="flex flex-col gap-1.5 relative">
      <div className="flex items-center justify-between min-h-4">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          {t(TK.title)}
        </span>
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer flex items-center justify-center"
          title="Create subtask"
        >
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="relative">
        <SearchSelect
          options={searchOptions}
          value=""
          onChange={handleAddSubtask}
          placeholder={t(TK.placeholder)}
          onSearchChange={setSearchQuery}
        />
        <ErrorTooltip message={fieldErrors.subtask || fieldErrors.parentId} />
      </div>

      {isLoadingChildren ? (
        <div className="flex flex-col gap-1.5 p-2 bg-muted/50 rounded-xl border border-border/60">
          <div className="p-4 text-center text-sm text-muted-foreground">
            {t(TK.loading)}
          </div>
        </div>
      ) : subtasks.length === 0 ? (
        <EmptyState
          title={t(TK.emptyTitle)}
          description={t(TK.emptyDesc)}
          className="py-4 px-5 sm:p-4 bg-muted/50 border border-border/60 rounded-xl"
        />
      ) : (
        <motion.div
          variants={STAGGER_CONTAINER_VARIANTS}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-1.5 p-2 bg-muted/50 rounded-xl border border-border/60"
        >
          <AnimatePresence mode="popLayout">
            {subtasks.map((task) => (
              <motion.div key={task.id} variants={SPRING_CARD_VARIANTS} layout>
                <IssueItemCard
                  issue={task}
                  onRemove={() => handleRemoveSubtask(task.id)}
                  onClick={() => onIssueSelect?.(task.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <CreateTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        projectId={projectId}
        parentId={parentId}
      />
    </div>
  );
}
