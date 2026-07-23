import { useState } from "react";
import { Select } from "@/components/ui/forms/select";
import { useIssues } from "@/features/projects/hooks/use-issues";
import { EmptyState } from "@/components/ui/data-display/empty-state";
import { IssueItemCard } from "./issue-item-card";
import { Issue } from "@/types/issue.types";

interface IssueLinkedIssuesProps {
  projectId: string;
  issue: Issue;
  onUpdate: (field: keyof Issue, value: unknown) => void;
}

export function IssueLinkedIssues({
  projectId,
  issue,
  onUpdate,
}: IssueLinkedIssuesProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: issuesResponse } = useIssues(projectId, {
    limit: 50,
    search: searchQuery || undefined,
  });
  const allIssues = issuesResponse?.data?.data || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Linked Issues
        </h3>
        <div className="flex items-center gap-1.5">
          <Select
            value=""
            onChange={(val) => {
              if (val) {
                const newLinks = [...(issue.links || []), val];
                onUpdate("links", newLinks);
              }
            }}
            className="h-6 text-[11px] min-w-[140px] font-medium"
            searchable
            onSearchChange={setSearchQuery}
          >
            <option value="">+ Link issue</option>
            {allIssues
              .filter(
                (i) => i.id !== issue.id && !(issue.links || []).includes(i.id),
              )
              .map((i) => (
                <option key={i.id} value={i.id}>
                  {i.issueKey} - {i.summary}
                </option>
              ))}
          </Select>
        </div>
      </div>

      {issue.links && issue.links.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          {issue.links.map((linkId) => {
            const linkedIssue = allIssues.find((i) => i.id === linkId);
            if (!linkedIssue) return null;
            return (
              <div key={linkId}>
                <IssueItemCard
                  issue={linkedIssue}
                  onRemove={() => {
                    const newLinks = issue.links!.filter((id) => id !== linkId);
                    onUpdate("links", newLinks);
                  }}
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
