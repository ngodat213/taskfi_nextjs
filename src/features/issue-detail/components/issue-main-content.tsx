import { useState } from "react";
import { Select } from "@/components/ui/forms/select";
import { TextEditor } from "@/components/ui/forms/text-editor";
import { AttachmentUploader } from "@/components/ui/forms/attachment-uploader";
import {
  useIssues,
  useIssueChildren,
} from "@/features/projects/hooks/use-issues";
import { Button, ButtonVariant } from "@/components/ui/actions/button";
import { SegmentedControl } from "@/components/ui/forms/segmented-control";
import { Issue, IssueStatus, IssueType } from "@/types/issue.types";
import {
  TypeIcon,
  StatusBadge,
} from "@/features/dashboard/components/issue-table-row";
import { cn } from "@/utils/cn";
import { MessageSquare, Activity } from "lucide-react";
import { IssueItemCard } from "./issue-item-card";
import { EmptyState } from "@/components/ui/data-display/empty-state";
import { CreateTaskModal } from "@/features/dashboard/components/create-task-modal";

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
  });
  const allIssues = issuesResponse?.data?.data || [];

  const { data: childrenResponse, isLoading: isLoadingChildren } =
    useIssueChildren(projectId, issue.id);
  const subtasks = childrenResponse?.data || [];

  const [desc, setDesc] = useState(issue.description || "");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isCreateSubtaskOpen, setIsCreateSubtaskOpen] = useState(false);
  const [prevDescProp, setPrevDescProp] = useState(issue.description);
  const [isLinking, setIsLinking] = useState(false);
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
              className="h-8 text-[13px] min-w-[200px] font-medium"
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
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Subtasks
          </h3>
          <Button
            variant={ButtonVariant.Ghost}
            className="h-6 text-[11px] px-2 py-0 font-medium text-muted-foreground hover:bg-secondary shrink-0"
            onClick={() => setIsCreateSubtaskOpen(true)}
          >
            + Create subtask
          </Button>
        </div>
        {isLoadingChildren ? (
          <div className="flex flex-col gap-1.5 p-2 bg-muted/50 rounded-xl border border-border/60">
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading subtasks...
            </div>
          </div>
        ) : subtasks.length === 0 ? (
          <EmptyState
            title="No subtasks yet"
            description="Create subtasks to break down this issue."
            className="py-4 px-5 sm:p-4 bg-muted/50 border border-border/60 rounded-xl"
          />
        ) : (
          <div className="flex flex-col gap-1.5 p-2 bg-muted/50 rounded-xl border border-border/60">
            {subtasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between py-1.5 px-2.5 bg-card hover:bg-muted rounded-lg border border-border/60 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2 overflow-hidden flex-1">
                  <TypeIcon
                    type={task.type as IssueType}
                    className="w-4 h-4 shrink-0"
                  />
                  <span className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider group-hover:text-foreground transition-colors shrink-0">
                    {task.issueKey}
                  </span>
                  <span
                    className={cn(
                      "text-[13px] font-medium tracking-tight transition-colors line-clamp-1 ml-1",
                      task.status === IssueStatus.DONE
                        ? "text-muted-foreground line-through"
                        : "text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400",
                    )}
                  >
                    {task.summary}
                  </span>
                </div>
                <div className="flex items-center shrink-0 ml-3 mr-1">
                  <StatusBadge status={task.status as IssueStatus} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Linked Issues */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Linked Issues
          </h3>
          {!isLinking && (
            <Button
              variant={ButtonVariant.Ghost}
              className="h-6 text-[11px] px-2 py-0 font-medium text-muted-foreground hover:bg-secondary shrink-0"
              onClick={() => setIsLinking(true)}
            >
              + Link issue
            </Button>
          )}
        </div>

        {isLinking && (
          <div className="mb-2 flex items-center gap-2 animate-in slide-in-from-top-1">
            <Select
              value=""
              onChange={(val) => {
                if (val) {
                  const newLinks = [...(issue.links || []), val];
                  onUpdate("links", newLinks);
                  setIsLinking(false);
                }
              }}
              className="h-8 text-[12px] flex-1 font-medium"
              searchable
              onSearchChange={setSearchQuery}
            >
              <option value="">Select an issue to link...</option>
              {allIssues
                .filter(
                  (i) =>
                    i.id !== issue.id && !(issue.links || []).includes(i.id),
                )
                .map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.issueKey} - {i.summary}
                  </option>
                ))}
            </Select>
            <Button
              variant={ButtonVariant.Ghost}
              className="h-8 px-2 text-muted-foreground"
              onClick={() => setIsLinking(false)}
            >
              Cancel
            </Button>
          </div>
        )}

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
                      const newLinks = issue.links!.filter(
                        (id) => id !== linkId,
                      );
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

      {/* Tabs for Comments & Activity */}
      <div className="mt-2">
        <SegmentedControl
          tabs={[
            { id: "comments", label: "Comments", icon: MessageSquare },
            { id: "activity", label: "Activity", icon: Activity },
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

      <CreateTaskModal
        isOpen={isCreateSubtaskOpen}
        onClose={() => setIsCreateSubtaskOpen(false)}
        projectId={projectId}
        parentId={issue.id}
      />
    </div>
  );
}
