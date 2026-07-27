"use client";
import { FileText } from "@phosphor-icons/react/dist/ssr";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalScrollArea,
  ModalFooter,
} from "@/components/ui/layout/modal";
import { Button, ButtonVariant } from "@/components/ui/actions/button";
import { FormInput } from "@/components/ui/forms/form-input";
import { FormTextarea } from "@/components/ui/forms/form-textarea";
import { Select } from "@/components/ui/forms/select";
import { InputLabel } from "@/components/ui/forms/input-label";
;
import { FileUploader } from "@/components/ui/forms/file-uploader";
import {
  useWorkspaceMembers,
  useWorkspaceConfig,
} from "@/features/workspaces/hooks/use-workspaces";
import { useWorkspaceStore } from "@/store/workspace.store";
import {
  useIssues,
  useCreateIssue,
} from "@/features/projects/hooks/use-issues";
import { APP_CONFIG } from "@/config/app.config";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useWatch } from "react-hook-form";
import { ErrorTooltip } from "@/components/ui/feedback/error-tooltip";
import { TRANSLATION_KEYS } from "@/constants/translations";
import { useTranslations } from "next-intl";

import {
  createTaskSchema,
  CreateTaskFormValues,
} from "@/features/dashboard/schema/create-task.schema";
import {
  DEFAULT_CREATE_TASK_VALUES,
  PRIORITY_OPTIONS,
  formatCreateTaskPayload,
} from "@/features/dashboard/helpers/create-task.helpers";
import { useEffect } from "react";

export interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  parentId?: string;
  defaultStatus?: string;
}

export function CreateTaskModal({
  isOpen,
  onClose,
  projectId,
  parentId,
  defaultStatus,
}: CreateTaskModalProps) {
  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId,
  );
  const t = useTranslations("Dashboard");
  const TK = TRANSLATION_KEYS.DASHBOARD.createTaskModal;

  const { data: membersResponse } = useWorkspaceMembers(
    activeWorkspaceId as string,
    {
      limit: APP_CONFIG.PAGINATION.MAX_LIMIT,
    },
  );
  const members = membersResponse?.data?.data || [];

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      ...DEFAULT_CREATE_TASK_VALUES,
      parentId: parentId || "",
      ...(defaultStatus ? { status: defaultStatus.toLowerCase() } : {}),
    },
    mode: "onChange",
  });

  const selectedType = useWatch({ control, name: "type" });

  const { data: issuesResponse } = useIssues(projectId, {
    limit: APP_CONFIG.PAGINATION.MAX_LIMIT,
    childType: selectedType || undefined,
  });
  const parentIssues = issuesResponse?.data?.data || [];

  const { data: configResponse } = useWorkspaceConfig(
    activeWorkspaceId as string,
  );
  const workspaceConfig = configResponse?.data;
  const issueTypes: { name: string }[] = workspaceConfig?.issueTypes || [];
  const statuses: { name: string }[] = workspaceConfig?.statuses || [];

  const createIssueMutation = useCreateIssue();

  useEffect(() => {
    if (isOpen) {
      reset({
        ...DEFAULT_CREATE_TASK_VALUES,
        parentId: parentId || "",
        ...(defaultStatus ? { status: defaultStatus.toLowerCase() } : {}),
      });
    }
  }, [isOpen, parentId, defaultStatus, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: CreateTaskFormValues) => {
    const payload = formatCreateTaskPayload(data);

    createIssueMutation.mutate(
      { projectId, data: payload },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
        onError: (error) => {
          console.error("Failed to create issue:", error);
        },
      },
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalContent maxWidth="max-w-[700px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader
            title={t(TK.title)}
            icon={<FileText className="w-4 h-4" />}
          />

          <ModalBody>
            <ModalScrollArea className="px-5 py-4 flex flex-col gap-5">
              {/* Summary */}
              <FormInput
                label={t(TK.summary)}
                required
                placeholder={t(TK.summaryPlaceholder)}
                {...register("summary")}
                error={errors.summary?.message}
              />

              {/* Description */}
              <FormTextarea
                label={t(TK.description)}
                placeholder={t(TK.descriptionPlaceholder)}
                className="min-h-25"
                {...register("description")}
                error={errors.description?.message}
              />

              <div className="grid grid-cols-2 gap-4">
                {/* Type */}
                <div className="flex flex-col gap-2 relative">
                  <InputLabel required>{t(TK.issueType)}</InputLabel>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onChange={field.onChange}>
                        {issueTypes.map((t) => (
                          <option key={t.name} value={t.name}>
                            {t.name}
                          </option>
                        ))}
                      </Select>
                    )}
                  />
                  <ErrorTooltip message={errors.type?.message} />
                </div>

                {/* Status */}
                <div className="flex flex-col gap-2 relative">
                  <InputLabel required>{t(TK.status)}</InputLabel>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onChange={field.onChange}>
                        {statuses.map((s) => (
                          <option key={s.name} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </Select>
                    )}
                  />
                  <ErrorTooltip message={errors.status?.message} />
                </div>

                {/* Priority */}
                <div className="flex flex-col gap-2 relative">
                  <InputLabel required>{t(TK.priority)}</InputLabel>
                  <Controller
                    name="priority"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onChange={field.onChange}>
                        {PRIORITY_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </Select>
                    )}
                  />
                  <ErrorTooltip message={errors.priority?.message} />
                </div>

                {/* Assignee */}
                <div className="flex flex-col gap-2 relative">
                  <InputLabel>{t(TK.assignee)}</InputLabel>
                  <Controller
                    name="assigneeId"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onChange={field.onChange}>
                        <option value="">{t(TK.unassigned)}</option>
                        {members.map((member) => (
                          <option key={member.id} value={member.userId}>
                            {member.username} ({member.email})
                          </option>
                        ))}
                      </Select>
                    )}
                  />
                </div>

                {/* Parent ID */}
                <div className="flex flex-col gap-2 col-span-2 relative">
                  <InputLabel>{t(TK.parentIssue)}</InputLabel>
                  <Controller
                    name="parentId"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onChange={field.onChange}>
                        <option value="">{t(TK.none)}</option>
                        {parentIssues.map((issue) => (
                          <option key={issue.id} value={issue.id}>
                            {issue.issueKey} - {issue.summary}
                          </option>
                        ))}
                      </Select>
                    )}
                  />
                </div>

                {/* Due Date */}
                <FormInput
                  type="datetime-local"
                  label={t(TK.dueDate)}
                  {...register("dueDate")}
                  error={errors.dueDate?.message}
                />

                {/* Story Points */}
                <FormInput
                  type="number"
                  label={t(TK.storyPoints)}
                  placeholder={t(TK.storyPointsPlaceholder)}
                  min="0"
                  {...register("storyPoints")}
                  error={errors.storyPoints?.message}
                />

                {/* Original Estimate */}
                <FormInput
                  type="number"
                  label={t(TK.originalEstimate)}
                  placeholder="0"
                  min="0"
                  {...register("originalEstimateSeconds")}
                  error={errors.originalEstimateSeconds?.message}
                />

                {/* Remaining Estimate */}
                <FormInput
                  type="number"
                  label={t(TK.remainingEstimate)}
                  placeholder="0"
                  min="0"
                  {...register("remainingEstimateSeconds")}
                  error={errors.remainingEstimateSeconds?.message}
                />
              </div>

              {/* Attachments */}
              <Controller
                name="attachments"
                control={control}
                render={({ field }) => (
                  <FileUploader
                    label={t(TK.attachments)}
                    value={field.value || []}
                    onChange={field.onChange}
                  />
                )}
              />
            </ModalScrollArea>
          </ModalBody>

          <ModalFooter>
            <Button
              variant={ButtonVariant.Outline}
              onClick={handleClose}
              disabled={createIssueMutation.isPending}
              type="button"
            >
              {t(TK.cancel)}
            </Button>
            <Button
              variant={ButtonVariant.Primary}
              type="submit"
              disabled={!isValid || createIssueMutation.isPending}
            >
              {createIssueMutation.isPending ? t(TK.creating) : t(TK.create)}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
