import { useState } from "react";
import { Button, ButtonVariant } from "@/components/ui/actions/button";
import {
  useIssues,
  useLinkIssue,
  useUnlinkIssue,
} from "@/features/projects/hooks/use-issues";
import { EmptyState } from "@/components/ui/data-display/empty-state";
import { IssueItemCard } from "./issue-item-card";
import { Issue, IssueLinkType } from "@/types/issue.types";
import { SearchSelect } from "@/components/ui/forms/search-select";
import { mapIssueToSearchOption } from "@/features/issue-detail/utils/issue-options.utils";
import { ErrorTooltip } from "@/components/ui/feedback/error-tooltip";
import { useAutoError } from "@/hooks/use-auto-error";

import { useWorkspaceConfig } from "@/features/workspaces/hooks/use-workspaces";
import { useWorkspaceStore } from "@/store/workspace.store";

interface IssueLinkedIssuesProps {
  projectId: string;
  issue: Issue;
  onUpdate: (field: keyof Issue, value: unknown) => void;
}

const RELATIONSHIP_OPTIONS = [
  { value: IssueLinkType.BLOCKS, label: "blocks" },
  { value: IssueLinkType.IS_BLOCKED_BY, label: "is blocked by" },
  { value: IssueLinkType.RELATES_TO, label: "relates to" },
  { value: IssueLinkType.DUPLICATES, label: "duplicates" },
  { value: IssueLinkType.IS_DUPLICATED_BY, label: "is duplicated by" },
  { value: IssueLinkType.CLONES, label: "clones" },
  { value: IssueLinkType.IS_CLONED_BY, label: "is cloned by" },
  { value: IssueLinkType.CAUSES, label: "causes" },
  { value: IssueLinkType.IS_CAUSED_BY, label: "is caused by" },
];

export function IssueLinkedIssues({
  projectId,
  issue,
  onUpdate,
}: IssueLinkedIssuesProps) {
  const [selectedLinkType, setSelectedLinkType] = useState<string>(
    IssueLinkType.BLOCKS,
  );
  const [targetIssueId, setTargetIssueId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const { fieldErrors, handleApiError, clearFieldError } = useAutoError();

  const linkIssue = useLinkIssue();
  const unlinkIssue = useUnlinkIssue();
  const { data: issuesResponse } = useIssues(projectId, {
    limit: 50,
    search: searchQuery || undefined,
  });
  const allIssues = issuesResponse?.data?.data || [];

  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const { data: configResponse } = useWorkspaceConfig(
    activeWorkspaceId as string,
  );
  const workspaceConfig = configResponse?.data;

  const relationshipOptions =
    workspaceConfig?.linkTypes && workspaceConfig.linkTypes.length > 0
      ? workspaceConfig.linkTypes.map((l) => ({
          value: l.type,
          label: l.outwardLabel || l.type,
        }))
      : RELATIONSHIP_OPTIONS;

  const existingLinkedIds = (issue.links || []).map((link) =>
    typeof link === "string" ? link : link.targetIssueId,
  );

  const availableIssues = allIssues.filter(
    (i) => i.id !== issue.id && !existingLinkedIds.includes(i.id),
  );

  const targetIssueOptions = availableIssues.map(mapIssueToSearchOption);

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
          const newLinks = (issue.links || []).filter((l) =>
            typeof l === "string"
              ? l !== targetId
              : l.targetIssueId !== targetId,
          );
          onUpdate("links", newLinks);
        },
        onError: (err) => handleApiError(err, "links"),
      },
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Linked Issues
        </h3>
      </div>

      {/* Relationship + Target Issue SearchSelect + Apply Button */}
      <div className="flex flex-col sm:flex-row gap-2 mb-3 items-stretch sm:items-center relative">
        <div className="w-full sm:flex-1 min-w-0">
          <SearchSelect
            options={targetIssueOptions}
            value={targetIssueId}
            onChange={(val) => setTargetIssueId(val)}
            placeholder="Target Issue"
            onSearchChange={setSearchQuery}
          />
        </div>
        <div className="w-full sm:w-40 shrink-0">
          <SearchSelect
            options={relationshipOptions}
            value={selectedLinkType}
            onChange={(val) => setSelectedLinkType(val)}
            placeholder="Relationship*"
          />
        </div>

        <Button
          variant={ButtonVariant.Primary}
          className="h-9 px-4 text-[13px] font-medium shrink-0"
          disabled={!targetIssueId || !selectedLinkType || linkIssue.isPending}
          onClick={handleApplyLink}
        >
          {linkIssue.isPending ? "Applying..." : "Apply"}
        </Button>
        <ErrorTooltip message={fieldErrors.links} />
      </div>

      {/* Linked Issues List */}
      {issue.links && issue.links.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          {issue.links.map((linkItem) => {
            const targetId =
              typeof linkItem === "string" ? linkItem : linkItem.targetIssueId;
            const linkedIssue = allIssues.find((i) => i.id === targetId);
            if (!linkedIssue) return null;
            return (
              <div key={targetId}>
                <IssueItemCard
                  issue={linkedIssue}
                  onRemove={() => handleRemoveLink(targetId)}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No linked issues"
          description="Link related issues to track dependencies."
          className="py-4 px-5 sm:p-4 bg-muted/50 border border-border/60 rounded-xl"
        />
      )}
    </div>
  );
}
