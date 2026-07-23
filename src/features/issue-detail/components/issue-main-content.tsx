import { ChatCircle, Pulse } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import { Select } from "@/components/ui/forms/select";
import { TextEditor } from "@/components/ui/forms/text-editor";
import { AttachmentUploader } from "@/components/ui/forms/attachment-uploader";
import { useIssues } from "@/features/projects/hooks/use-issues";
import { SegmentedControl } from "@/components/ui/forms/segmented-control";
import { Issue } from "@/types/issue.types";
import { IssueItemCard } from "./issue-item-card";
import { EmptyState } from "@/components/ui/data-display/empty-state";
import { IssueSubtasks } from "./issue-subtasks";
import { IssueLinkedIssues } from "./issue-linked-issues";

interface IssueMainContentProps {
  issue: Issue;
  projectId: string;
  onUpdate: (field: keyof Issue, value: unknown) => void;
}

export function IssueMainContent({
  issue,
  projectId,
  onUpdate,
}: IssueMainContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: issuesResponse } = useIssues(projectId, {
    limit: 50,
    search: searchQuery || undefined,
    hasParent: false,
  });
  const allIssues = issuesResponse?.data?.data || [];

  const [desc, setDesc] = useState(issue.description || "");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [prevDescProp, setPrevDescProp] = useState(issue.description);
  const [activeTab, setActiveTab] = useState("comments");

  if (issue.description !== prevDescProp) {
    setPrevDescProp(issue.description);
    setDesc(issue.description || "");
  }

  const handleDescBlur = () => {
    if (desc !== issue.description) {
      onUpdate("description", desc || null);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-5">
      {/* Parent Task */}
      <div className="flex flex-col items-start gap-1.5 w-full">
        <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Parent Task
        </h3>
        {(() => {
          const parentIssue = issue.parentId
            ? allIssues.find((i) => i.id === issue.parentId)
            : null;

          if (parentIssue) {
            return (
              <IssueItemCard
                issue={parentIssue}
                onRemove={() => onUpdate("parentId", null)}
              />
            );
          }

          return (
            <Select
              value=""
              onChange={(val) => onUpdate("parentId", val || null)}
              className="h-8 text-[13px] min-w-50 font-medium"
              searchable
              onSearchChange={setSearchQuery}
            >
              <option value="">+ Add Parent Task</option>
              {allIssues
                .filter((i) => i.id !== issue.id)
                .map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.issueKey} - {i.summary}
                  </option>
                ))}
            </Select>
          );
        })()}
      </div>

      {/* Description */}
      <div>
        <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
          Description
        </h3>
        <TextEditor
          value={desc}
          onChange={setDesc}
          onBlur={handleDescBlur}
          placeholder="Add a description..."
        />
      </div>

      {/* Attachments */}
      <AttachmentUploader value={attachments} onChange={setAttachments} />

      {/* Subtasks */}
      <IssueSubtasks projectId={projectId} parentId={issue.id} />

      {/* Linked Issues */}
      <IssueLinkedIssues
        projectId={projectId}
        issue={issue}
        onUpdate={onUpdate}
      />

      {/* Tabs for Comments & Activity */}
      <div className="mt-2">
        <SegmentedControl
          tabs={[
            { id: "comments", label: "Comments", icon: ChatCircle },
            { id: "activity", label: "Activity", icon: Pulse },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {activeTab === "comments" && (
        <div className="flex flex-col gap-4 mt-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground text-[12px] font-medium shrink-0">
              U
            </div>
            <div className="flex-1 bg-muted/50 rounded-lg border border-border/60 px-4 py-3 text-[13px] text-muted-foreground italic">
              Write a comment... (Coming soon)
            </div>
          </div>
        </div>
      )}

      {activeTab === "activity" && (
        <div className="flex flex-col gap-4 mt-2 animate-in fade-in duration-200">
          <EmptyState
            title="No activity yet"
            description="Activity history will appear here."
            className="py-6 px-5 sm:p-6 bg-muted/50 border border-border/60 rounded-xl"
          />
        </div>
      )}
    </div>
  );
}
