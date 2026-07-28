import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  PlusIcon,
  CheckSquareIcon,
  LinkIcon,
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
import { SearchSelect } from "@/components/ui/forms/search-select";
import { ErrorTooltip } from "@/components/ui/feedback/error-tooltip";
import { useAutoError } from "@/hooks/use-auto-error";
import {
  useChildOptions,
  useCreateIssue,
  useUpdateIssue,
} from "@/features/projects/hooks/use-issues";
import { PRIORITY_OPTIONS } from "@/features/dashboard/helpers/create-task.helpers";
import { mapIssueToSearchOption } from "@/features/issue-detail/utils/issue-options.utils";
import { useWorkspaceMembers } from "@/features/workspaces/hooks/use-workspaces";
import { useWorkspaceStore } from "@/store/workspace.store";
import { TRANSLATION_KEYS } from "@/constants/translations";

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
  const t = useTranslations("Dashboard");
  const TK = TRANSLATION_KEYS.DASHBOARD.AddSubtaskModal;

  const [mode, setMode] = useState<"create" | "link">("create");
  const [summary, setSummary] = useState("");
  const [priority, setPriority] = useState<string>("medium");
  const [assigneeId, setAssigneeId] = useState<string>("");
  const [selectedIssueId, setSelectedIssueId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const { fieldErrors, handleApiError, clearFieldError } = useAutoError();

  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId,
  );
  const { data: membersResponse } = useWorkspaceMembers(
    activeWorkspaceId as string,
    { limit: 50 },
  );
  const members = membersResponse?.data?.data || [];

  const { data: childOptionsResponse } = useChildOptions(projectId, {
    search: searchQuery || undefined,
  });
  const childIssues = childOptionsResponse?.data || [];
  const availableIssues = childIssues.filter((i) => i.id !== parentId);
  const searchOptions = availableIssues.map(mapIssueToSearchOption);

  const createIssueMutation = useCreateIssue();
  const updateIssueMutation = useUpdateIssue();

  const handleReset = () => {
    setSummary("");
    setPriority("medium");
    setAssigneeId("");
    setSelectedIssueId("");
    setSearchQuery("");
    clearFieldError("submit");
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearFieldError("submit");

    if (mode === "create") {
      const trimmedSummary = summary.trim();
      if (!trimmedSummary) return;

      createIssueMutation.mutate(
        {
          projectId,
          data: {
            summary: trimmedSummary,
            type: "subtask",
            status: "To Do",
            priority,
            assigneeId: assigneeId || undefined,
            parentId,
          },
        },
        {
          onSuccess: handleClose,
          onError: (err) => handleApiError(err, "submit"),
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
          onSuccess: handleClose,
          onError: (err) => handleApiError(err, "submit"),
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
          title={t(TK.title)}
          icon={<CheckSquareIcon className="w-4 h-4 text-primary" />}
        />
        <form onSubmit={handleSubmit}>
          <ModalBody className="p-5 sm:p-6 space-y-5 overflow-visible!">
            {/* Mode Switcher */}
            <div className="flex justify-center mb-1">
              <SegmentedControl
                tabs={[
                  { id: "create", label: t(TK.modeCreate), icon: PlusIcon },
                  { id: "link", label: t(TK.modeLink), icon: LinkIcon },
                ]}
                activeTab={mode}
                onTabChange={(id) => setMode(id as "create" | "link")}
              />
            </div>

            {mode === "create" ? (
              <>
                <div className="flex flex-col gap-1.5">
                  <InputLabel required>{t(TK.subtaskTitle)}</InputLabel>
                  <Input
                    type="text"
                    placeholder={t(TK.titlePlaceholder)}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <InputLabel>{t(TK.priority)}</InputLabel>
                    <Select value={priority} onChange={setPriority}>
                      {PRIORITY_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <InputLabel>{t(TK.assignee)}</InputLabel>
                    <Select value={assigneeId} onChange={setAssigneeId}>
                      <option value="">{t(TK.unassigned)}</option>
                      {members.map((m) => (
                        <option key={m.userId} value={m.userId}>
                          {m.username || m.fullName || m.name || m.email}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-1.5">
                <InputLabel required>{t(TK.selectTask)}</InputLabel>
                <SearchSelect
                  options={searchOptions}
                  value={selectedIssueId}
                  onChange={setSelectedIssueId}
                  onSearchChange={setSearchQuery}
                  placeholder={t(TK.selectTaskPlaceholder)}
                />
              </div>
            )}

            {fieldErrors.submit && (
              <ErrorTooltip
                message={fieldErrors.submit}
                className="relative top-0 mt-2"
              />
            )}

            <ModalFooter className="px-0 pt-2 pb-0 border-t-0">
              <Button
                type="button"
                variant={ButtonVariant.Outline}
                onClick={handleClose}
              >
                {t(TK.cancel)}
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
                  ? t(TK.adding)
                  : mode === "create"
                    ? t(TK.createBtn)
                    : t(TK.attachBtn)}
              </Button>
            </ModalFooter>
          </ModalBody>
        </form>
      </ModalContent>
    </Modal>
  );
}
