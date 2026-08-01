import { useState } from "react";

import { useTranslations } from "next-intl";

import { AnimatePresence, motion } from "framer-motion";

import { Button, ButtonVariant } from "@/components/ui/actions/button";
import { EmptyState } from "@/components/ui/data-display/empty-state";
import { ErrorTooltip } from "@/components/ui/feedback/error-tooltip";
import { SearchSelect } from "@/components/ui/forms/search-select";
import { APP_CONFIG } from "@/config/app.config";
import {
  SPRING_CARD_VARIANTS,
  STAGGER_CONTAINER_VARIANTS,
} from "@/constants/animations";
import { TRANSLATION_KEYS } from "@/constants/translations";
import { IssueItemCard } from "@/features/issue-detail/components/issue-item-card";
import {
  getLinkTargetId,
  mapIssueToSearchOption,
  resolveRelationshipOptions,
} from "@/features/issue-detail/utils/issue-options.utils";
import {
  useIssues,
  useLinkIssue,
  useUnlinkIssue,
} from "@/features/projects/hooks/use-issues";
import { useWorkspaceConfig } from "@/features/workspaces/hooks/use-workspaces";
import { useAutoError } from "@/hooks/use-auto-error";
import { useWorkspaceStore } from "@/store/workspace.store";
import { Issue, IssueLinkType } from "@/types/issue.types";

interface IssueLinkedIssuesProps {
  projectId: string;
  issue: Issue;
  onUpdate: (field: keyof Issue, value: unknown) => void;
  onIssueSelect?: (issueId: string) => void;
}

export function IssueLinkedIssues({
  projectId,
  issue,
  onUpdate,
  onIssueSelect,
}: IssueLinkedIssuesProps) {
  const t = useTranslations("Dashboard");
  const TK = TRANSLATION_KEYS.DASHBOARD.IssueLinkedIssues;

  const [selectedLinkType, setSelectedLinkType] = useState<string>(
    IssueLinkType.BLOCKS,
  );
  const [targetIssueId, setTargetIssueId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const { fieldErrors, handleApiError, clearFieldError } = useAutoError();

  const linkIssue = useLinkIssue();
  const unlinkIssue = useUnlinkIssue();
  const { data: issuesResponse } = useIssues(projectId, {
    limit: APP_CONFIG.PAGINATION.MAX_LIMIT,
    search: searchQuery || undefined,
  });
  const allIssues = issuesResponse?.data?.data || [];

  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId,
  );
  const { data: configResponse } = useWorkspaceConfig(
    activeWorkspaceId as string,
  );
  const workspaceConfig = configResponse?.data;

  const relationshipOptions = resolveRelationshipOptions(workspaceConfig);

  const existingLinkedIds = (issue.links || []).map(getLinkTargetId);

  const availableIssues = allIssues.filter(
    (item) => item.id !== issue.id && !existingLinkedIds.includes(item.id),
  );

  const targetIssueOptions = availableIssues.map(mapIssueToSearchOption);

  const validLinkedIssues = (issue.links || [])
    .map((linkItem) => {
      const targetId = getLinkTargetId(linkItem);
      return allIssues.find((target) => target.id === targetId);
    })
    .filter((linkedIssue): linkedIssue is Issue => Boolean(linkedIssue));

  const handleApplyLink = () => {
    if (!targetIssueId || !selectedLinkType) return;
    clearFieldError("links");

    linkIssue.mutate(
      {
        projectId,
        issueId: issue.id,
        targetIssueId,
        type: selectedLinkType,
      },
      {
        onSuccess: () => {
          const newLink = { type: selectedLinkType, targetIssueId };
          onUpdate("links", [...(issue.links || []), newLink]);
          setTargetIssueId("");
        },
        onError: (err) => handleApiError(err, "links"),
      },
    );
  };

  const handleRemoveLink = (targetId: string) => {
    clearFieldError("links");
    unlinkIssue.mutate(
      {
        projectId,
        issueId: issue.id,
        targetIssueId: targetId,
      },
      {
        onSuccess: () => {
          const newLinks = (issue.links || []).filter(
            (linkItem) => getLinkTargetId(linkItem) !== targetId,
          );
          onUpdate("links", newLinks);
        },
        onError: (err) => handleApiError(err, "links"),
      },
    );
  };

  return (
    <div className="flex flex-col gap-1.5 relative">
      <div className="flex items-center justify-between min-h-4">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          {t(TK.title)}
        </span>
      </div>

      {/* Relationship + Target Issue SearchSelect + Apply Button */}
      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center relative">
        <div className="w-full sm:flex-1 min-w-0">
          <SearchSelect
            options={targetIssueOptions}
            value={targetIssueId}
            onChange={setTargetIssueId}
            placeholder={t(TK.targetPlaceholder)}
            onSearchChange={setSearchQuery}
          />
        </div>
        <div className="w-full sm:w-40 shrink-0">
          <SearchSelect
            options={relationshipOptions}
            value={selectedLinkType}
            onChange={setSelectedLinkType}
            placeholder={t(TK.relationshipPlaceholder)}
          />
        </div>

        <Button
          variant={ButtonVariant.Primary}
          className="h-9 px-4 text-[13px] font-medium shrink-0"
          disabled={!targetIssueId || !selectedLinkType || linkIssue.isPending}
          onClick={handleApplyLink}
        >
          {linkIssue.isPending ? t(TK.applying) : t(TK.apply)}
        </Button>
        <ErrorTooltip message={fieldErrors.links} />
      </div>

      {/* Linked Issues List */}
      {validLinkedIssues.length > 0 ? (
        <motion.div
          variants={STAGGER_CONTAINER_VARIANTS}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-1.5 p-2 bg-muted/50 rounded-xl border border-border/60"
        >
          <AnimatePresence mode="popLayout">
            {validLinkedIssues.map((linkedIssue) => (
              <motion.div
                key={linkedIssue.id}
                variants={SPRING_CARD_VARIANTS}
                layout
              >
                <IssueItemCard
                  issue={linkedIssue}
                  onRemove={() => handleRemoveLink(linkedIssue.id)}
                  onClick={() => onIssueSelect?.(linkedIssue.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <EmptyState
          title={t(TK.emptyTitle)}
          description={t(TK.emptyDesc)}
          className="py-4 px-5 sm:p-4 bg-muted/50 border border-border/60 rounded-xl"
        />
      )}
    </div>
  );
}
