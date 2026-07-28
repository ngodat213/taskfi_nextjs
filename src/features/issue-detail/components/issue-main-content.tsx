import { useState } from "react";
import { SearchSelect } from "@/components/ui/forms/search-select";
import { TextEditor } from "@/components/ui/forms/text-editor";
import { AttachmentUploader } from "@/components/ui/forms/attachment-uploader";
import { useParentOptions } from "@/features/projects/hooks/use-issues";
import { Issue } from "@/types/issue.types";
import { IssueItemCard } from "./issue-item-card";
import { IssueSubtasks } from "./issue-subtasks";
import { IssueLinkedIssues } from "./issue-linked-issues";
import { ErrorTooltip } from "@/components/ui/feedback/error-tooltip";
import { mapIssueToSearchOption } from "@/features/issue-detail/utils/issue-options.utils";

import { useDeleteImage } from "@/hooks/use-upload";
import { getPublicIdFromAttachment } from "@/utils/cloudinary";

import { IssueComments } from "./issue-comments";

interface IssueMainContentProps {
  issue: Issue;
  projectId: string;
  onUpdate: (field: keyof Issue, value: unknown) => void;
  fieldErrors?: Record<string, string>;
}

export function IssueMainContent({
  issue,
  projectId,
  onUpdate,
  fieldErrors,
}: IssueMainContentProps) {
  const deleteImageMutation = useDeleteImage();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: parentOptionsResponse } = useParentOptions(projectId, {
    type: issue.type,
    search: searchQuery || undefined,
  });
  const allIssues = parentOptionsResponse?.data || [];

  const [desc, setDesc] = useState(issue.description || "");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [prevDescProp, setPrevDescProp] = useState(issue.description);

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
      <div className="flex flex-col items-start gap-1.5 w-full relative">
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

          const parentOptions = allIssues
            .filter((i) => i.id !== issue.id)
            .map(mapIssueToSearchOption);

          return (
            <SearchSelect
              options={parentOptions}
              value=""
              onChange={(val) => onUpdate("parentId", val || null)}
              placeholder="Add Parent Task"
              onSearchChange={setSearchQuery}
            />
          );
        })()}
        <ErrorTooltip message={fieldErrors?.parentId} />
      </div>

      {/* Description */}
      <div className="relative">
        <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
          Description
        </h3>
        <TextEditor
          value={desc}
          onChange={setDesc}
          onBlur={handleDescBlur}
          placeholder="Add a description..."
        />
        <ErrorTooltip message={fieldErrors?.description} />
      </div>

      {/* Attachments */}
      <AttachmentUploader
        attachments={issue.attachments}
        value={attachments}
        uploaderId={issue.reporterId}
        error={fieldErrors?.attachments}
        onChange={setAttachments}
        onAttachmentsChange={(newAttachments) => {
          onUpdate("attachments", newAttachments);
        }}
        onRemoveAttachment={(att) => {
          const publicId = getPublicIdFromAttachment(att);
          if (publicId) {
            deleteImageMutation.mutate(publicId);
          }
          const targetUrl = typeof att === "string" ? att : att.fileUrl;
          const current = (issue.attachments || []).filter((a) => {
            const url = typeof a === "string" ? a : a.fileUrl;
            return url !== targetUrl;
          });
          onUpdate("attachments", current);
        }}
      />

      {/* Subtasks */}
      <IssueSubtasks projectId={projectId} parentId={issue.id} />

      {/* Linked Issues */}
      <IssueLinkedIssues
        projectId={projectId}
        issue={issue}
        onUpdate={onUpdate}
      />

      {/* Comments Section */}
      <div className="flex flex-col gap-2 mt-2">
        <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Comments
        </h3>
        <IssueComments issue={issue} />
      </div>
    </div>
  );
}
