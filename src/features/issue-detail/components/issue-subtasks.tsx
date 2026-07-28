import { useState } from "react";
import { useTranslations } from "next-intl";
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

interface IssueSubtasksProps {
  projectId: string;
  parentId: string;
}

export function IssueSubtasks({ projectId, parentId }: IssueSubtasksProps) {
  const t = useTranslations("Dashboard");
  const TK = TRANSLATION_KEYS.DASHBOARD.IssueSubtasks;

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
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          {t(TK.title)}
        </h3>
      </div>

      <div className="mb-3 relative">
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
        <div className="flex flex-col gap-1.5 p-2 bg-muted/50 rounded-xl border border-border/60">
          {subtasks.map((task) => (
            <IssueItemCard
              key={task.id}
              issue={task}
              onRemove={() => handleRemoveSubtask(task.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
