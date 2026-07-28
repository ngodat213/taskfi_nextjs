import React, { useState } from "react";
import { LinkIcon as LinkIcon } from "@phosphor-icons/react/dist/ssr";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/layout/modal";
import { Button, ButtonVariant } from "@/components/ui/actions/button";
import { Select } from "@/components/ui/forms/select";
import { InputLabel } from "@/components/ui/forms/input-label";
import { useWorkspaceConfig } from "@/features/workspaces/hooks/use-workspaces";
import { useWorkspaceStore } from "@/store/workspace.store";
import { useIssues, useLinkIssue } from "@/features/projects/hooks/use-issues";
import { Issue, IssueLinkType } from "@/types/issue.types";

interface LinkIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  issue: Issue;
}

export function LinkIssueModal({
  isOpen,
  onClose,
  projectId,
  issue,
}: LinkIssueModalProps) {
  const [selectedLinkType, setSelectedLinkType] = useState<string>(
    IssueLinkType.BLOCKS,
  );
  const [targetIssueId, setTargetIssueId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const { data: configResponse } = useWorkspaceConfig(
    activeWorkspaceId as string,
  );
  const workspaceConfig = configResponse?.data;
  const linkTypes = workspaceConfig?.linkTypes || [];

  const linkIssue = useLinkIssue();

  const { data: issuesResponse } = useIssues(projectId, {
    limit: 50,
    search: searchQuery || undefined,
  });
  const allIssues = issuesResponse?.data?.data || [];

  const existingLinkedIds = (issue.links || []).map((link) =>
    typeof link === "string" ? link : link.targetIssueId,
  );

  const availableIssues = allIssues.filter(
    (i) => i.id !== issue.id && !existingLinkedIds.includes(i.id),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetIssueId) return;

    linkIssue.mutate(
      {
        projectId,
        issueId: issue.id,
        targetIssueId,
        type: selectedLinkType,
      },
      {
        onSuccess: () => {
          setTargetIssueId("");
          onClose();
        },
      },
    );
  };

  const fieldStyle = "h-9 text-[13px] w-full";

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent className="max-w-md overflow-visible!">
        <ModalHeader
          title="Link Issue"
          icon={<LinkIcon className="w-4 h-4 text-primary" />}
        />
        <form onSubmit={handleSubmit}>
          <ModalBody className="p-5 sm:p-6 space-y-5 overflow-visible!">
            <div className="flex flex-col gap-1.5">
              <InputLabel required>Relationship</InputLabel>
              <Select
                value={selectedLinkType}
                onChange={(val) => setSelectedLinkType(val)}
                className={fieldStyle}
              >
                {linkTypes.length > 0 ? (
                  linkTypes.map((l) => (
                    <option key={l.type} value={l.type}>
                      {l.outwardLabel || l.type}
                    </option>
                  ))
                ) : (
                  <>
                    <option value={IssueLinkType.BLOCKS}>blocks</option>
                    <option value={IssueLinkType.IS_BLOCKED_BY}>
                      is blocked by
                    </option>
                    <option value={IssueLinkType.RELATES_TO}>relates to</option>
                    <option value={IssueLinkType.DUPLICATES}>duplicates</option>
                    <option value={IssueLinkType.IS_DUPLICATED_BY}>
                      is duplicated by
                    </option>
                    <option value={IssueLinkType.CLONES}>clones</option>
                    <option value={IssueLinkType.IS_CLONED_BY}>
                      is cloned by
                    </option>
                    <option value={IssueLinkType.CAUSES}>causes</option>
                    <option value={IssueLinkType.IS_CAUSED_BY}>
                      is caused by
                    </option>
                  </>
                )}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <InputLabel required>Target Issue</InputLabel>
              <Select
                value={targetIssueId}
                onChange={(val) => setTargetIssueId(val)}
                className={fieldStyle}
                searchable
                onSearchChange={setSearchQuery}
              >
                <option value="">Select target issue...</option>
                {availableIssues.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.issueKey} - {item.summary}
                  </option>
                ))}
              </Select>
            </div>
            <ModalFooter className="px-0 pt-2 pb-0 border-t-0">
              <Button
                type="button"
                variant={ButtonVariant.Outline}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant={ButtonVariant.Primary}
                disabled={!targetIssueId || linkIssue.isPending}
              >
                {linkIssue.isPending ? "Linking..." : "Link Issue"}
              </Button>
            </ModalFooter>
          </ModalBody>
        </form>
      </ModalContent>
    </Modal>
  );
}
