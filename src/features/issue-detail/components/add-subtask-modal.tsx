import React, { useState } from "react";
import {
  Plus,
  CheckSquare,
  Link as LinkIcon,
} from "@phosphor-icons/react/dist/ssr";
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
import { Input } from "@/components/ui/forms/input";
import { SegmentedControl } from "@/components/ui/forms/segmented-control";
import {
  useIssues,
  useCreateIssue,
  useUpdateIssue,
} from "@/features/projects/hooks/use-issues";
import { PRIORITY_OPTIONS } from "@/features/dashboard/helpers/create-task.helpers";
import { useWorkspaceMembers } from "@/features/workspaces/hooks/use-workspaces";
import { useWorkspaceStore } from "@/store/workspace.store";

interface AddSubtaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  parentId: string;
}

export function AddSubtaskModal({
  isOpen,
  onClose,
  projectId,
  parentId,
}: AddSubtaskModalProps) {
  const [mode, setMode] = useState<"create" | "link">("create");
  const [summary, setSummary] = useState("");
  const [priority, setPriority] = useState<string>("medium");
  const [assigneeId, setAssigneeId] = useState<string>("");
  const [selectedIssueId, setSelectedIssueId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId,
  );
  const { data: membersResponse } = useWorkspaceMembers(
    activeWorkspaceId as string,
    { limit: 50 },
  );
  const members = membersResponse?.data?.data || [];

  const { data: issuesResponse } = useIssues(projectId, {
    limit: 50,
    search: searchQuery || undefined,
    hasParent: false,
  });
  const allIssues = issuesResponse?.data?.data || [];
  const availableIssues = allIssues.filter((i) => i.id !== parentId);

  const createIssueMutation = useCreateIssue();
  const updateIssueMutation = useUpdateIssue();

  const handleReset = () => {
    setSummary("");
    setPriority("medium");
    setAssigneeId("");
    setSelectedIssueId("");
    setSearchQuery("");
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "create") {
      if (!summary.trim()) return;
      createIssueMutation.mutate(
        {
          projectId,
          data: {
            summary: summary.trim(),
            type: "subtask",
            status: "To Do",
            priority,
            assigneeId: assigneeId || undefined,
            parentId,
          },
        },
        {
          onSuccess: () => {
            handleClose();
          },
        },
      );
    } else {
      if (!selectedIssueId) return;
      updateIssueMutation.mutate(
        {
          projectId,
          issueId: selectedIssueId,
          data: { parentId },
        },
        {
          onSuccess: () => {
            handleClose();
          },
        },
      );
    }
  };

  const isPending =
    createIssueMutation.isPending || updateIssueMutation.isPending;

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalContent className="max-w-md overflow-visible!">
        <ModalHeader
          title="Add Subtask"
          icon={<CheckSquare className="w-4 h-4 text-primary" />}
        />
        <form onSubmit={handleSubmit}>
          <ModalBody className="p-5 sm:p-6 space-y-5 overflow-visible!">
            {/* Mode Switcher */}
            <div className="flex justify-center mb-1">
              <SegmentedControl
                tabs={[
                  { id: "create", label: "Create New Subtask", icon: Plus },
                  { id: "link", label: "Link Existing Task", icon: LinkIcon },
                ]}
                activeTab={mode}
                onTabChange={(id) => setMode(id as "create" | "link")}
              />
            </div>

            {mode === "create" ? (
              <>
                <div className="flex flex-col gap-1.5">
                  <InputLabel required>Subtask Title</InputLabel>
                  <Input
                    type="text"
                    placeholder="Enter subtask title..."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={priority}
                      onChange={(val) => setPriority(val)}
                    >
                      {PRIORITY_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <InputLabel>Assignee</InputLabel>
                    <Select
                      value={assigneeId}
                      onChange={(val) => setAssigneeId(val)}
                    >
                      <option value="">Unassigned</option>
                      {members.map((m) => (
                        <option key={m.userId} value={m.userId}>
                          {m.username || m.email}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-1.5">
                <InputLabel required>Select Task to Attach</InputLabel>
                <Select
                  value={selectedIssueId}
                  onChange={(val) => setSelectedIssueId(val)}
                  searchable
                  onSearchChange={setSearchQuery}
                >
                  <option value="">Select an existing task...</option>
                  {availableIssues.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.issueKey} - {item.summary}
                    </option>
                  ))}
                </Select>
              </div>
            )}

            <ModalFooter className="px-0 pt-2 pb-0 border-t-0">
              <Button
                type="button"
                variant={ButtonVariant.Outline}
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant={ButtonVariant.Primary}
                disabled={
                  isPending ||
                  (mode === "create" ? !summary.trim() : !selectedIssueId)
                }
              >
                {isPending
                  ? "Adding..."
                  : mode === "create"
                    ? "Create Subtask"
                    : "Attach Subtask"}
              </Button>
            </ModalFooter>
          </ModalBody>
        </form>
      </ModalContent>
    </Modal>
  );
}
