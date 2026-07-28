"use client";
import { useState, useEffect, useRef } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileTextIcon } from "@phosphor-icons/react/dist/ssr";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalScrollArea,
  ModalFooter,
} from "@/components/ui/layout/modal";
import { Button, ButtonVariant } from "@/components/ui/actions/button";
import { Select } from "@/components/ui/forms/select";
import {
  SearchSelect,
  SearchSelectOption,
} from "@/components/ui/forms/search-select";
import { TextEditor } from "@/components/ui/forms/text-editor";
import { FileUploader } from "@/components/ui/forms/file-uploader";
import { ErrorTooltip } from "@/components/ui/feedback/error-tooltip";
import {
  TypeIcon,
  StatusBadge,
} from "@/features/dashboard/components/issue-table-row";
import { IssueItemCard } from "@/features/issue-detail/components/issue-item-card";
import { mapIssueToSearchOption } from "@/features/issue-detail/utils/issue-options.utils";

import { useWorkspaceStore } from "@/store/workspace.store";
import {
  useWorkspaceMembers,
  useWorkspaceConfig,
} from "@/features/workspaces/hooks/use-workspaces";
import {
  useIssues,
  useParentOptions,
  useChildOptions,
  useCreateIssue,
  useUpdateIssue,
} from "@/features/projects/hooks/use-issues";
import { useCurrentUser } from "@/features/auth/hooks/use-auth";
import { APP_CONFIG } from "@/config/app.config";
import { Issue, IssueType, IssueStatus } from "@/types/issue.types";
import { cn } from "@/utils/cn";

import {
  createTaskSchema,
  CreateTaskFormValues,
} from "@/features/dashboard/schema/create-task.schema";
import {
  DEFAULT_CREATE_TASK_VALUES,
  PRIORITY_OPTIONS,
  formatCreateTaskPayload,
} from "@/features/dashboard/helpers/create-task.helpers";

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
  const { data: currentUserResponse } = useCurrentUser();
  const currentUserId = currentUserResponse?.data?.id;

  const { data: membersResponse } = useWorkspaceMembers(
    activeWorkspaceId as string,
    { limit: APP_CONFIG.PAGINATION.MAX_LIMIT },
  );
  const members = membersResponse?.data?.data || [];

  const { data: configResponse } = useWorkspaceConfig(
    activeWorkspaceId as string,
  );
  const workspaceConfig = configResponse?.data;
  const issueTypes: { name: string }[] = workspaceConfig?.issueTypes || [];
  const statuses: { name: string }[] = workspaceConfig?.statuses || [];

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
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
  const selectedStatus = useWatch({ control, name: "status" });
  const selectedPriority = useWatch({ control, name: "priority" });
  const selectedAssigneeId = useWatch({ control, name: "assigneeId" });
  const selectedParentId = useWatch({ control, name: "parentId" });
  const selectedStoryPoints = useWatch({ control, name: "storyPoints" });

  const [selectedChildIds, setSelectedChildIds] = useState<string[]>([]);
  const [subtaskSearchQuery, setSubtaskSearchQuery] = useState("");
  const [parentSearchQuery, setParentSearchQuery] = useState("");

  const { data: parentIssuesResponse } = useParentOptions(projectId, {
    type: selectedType || "task",
    search: parentSearchQuery || undefined,
  });
  const parentIssues = parentIssuesResponse?.data || [];

  const { data: childOptionsResponse } = useChildOptions(projectId, {
    parentType: selectedType || "task",
    search: subtaskSearchQuery || undefined,
  });
  const childIssues = childOptionsResponse?.data || [];

  const { data: issuesResponse } = useIssues(projectId, {
    limit: APP_CONFIG.PAGINATION.MAX_LIMIT,
  });
  const allIssues = issuesResponse?.data?.data || [];

  const createIssueMutation = useCreateIssue();
  const updateIssueMutation = useUpdateIssue();

  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const typeDropdownRef = useRef<HTMLDivElement>(null);
  const summaryTextareaRef = useRef<HTMLTextAreaElement>(null);

  const [prevIsOpen, setPrevIsOpen] = useState(false);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setSelectedChildIds([]);
    }
  }

  useEffect(() => {
    if (isOpen) {
      reset({
        ...DEFAULT_CREATE_TASK_VALUES,
        parentId: parentId || "",
        ...(defaultStatus ? { status: defaultStatus.toLowerCase() } : {}),
      });
    }
  }, [isOpen, parentId, defaultStatus, reset]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        typeDropdownRef.current &&
        !typeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsTypeDropdownOpen(false);
      }
    };
    if (isTypeDropdownOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isTypeDropdownOpen]);

  const handleClose = () => {
    reset();
    setSelectedChildIds([]);
    onClose();
  };

  const onSubmit = (data: CreateTaskFormValues) => {
    const payload = formatCreateTaskPayload(data);

    createIssueMutation.mutate(
      { projectId, data: payload },
      {
        onSuccess: (res) => {
          const newIssueId = res.data?.id;
          if (newIssueId && selectedChildIds.length > 0) {
            selectedChildIds.forEach((childId) => {
              updateIssueMutation.mutate({
                projectId,
                issueId: childId,
                data: { parentId: newIssueId },
              });
            });
          }
          reset();
          setSelectedChildIds([]);
          onClose();
        },
        onError: (error) => {
          console.error("Failed to create issue:", error);
        },
      },
    );
  };

  const parentIssue = selectedParentId
    ? parentIssues.find((i) => i.id === selectedParentId) ||
      allIssues.find((i) => i.id === selectedParentId)
    : null;

  const parentOptions: SearchSelectOption[] = parentIssues
    .filter((i) => !selectedChildIds.includes(i.id))
    .map(mapIssueToSearchOption);

  const subtaskOptions: SearchSelectOption[] = childIssues
    .filter(
      (i) => i.id !== selectedParentId && !selectedChildIds.includes(i.id),
    )
    .map(mapIssueToSearchOption);

  const selectedChildIssues = selectedChildIds
    .map(
      (id) =>
        childIssues.find((i) => i.id === id) ||
        allIssues.find((i) => i.id === id),
    )
    .filter((i): i is Issue => Boolean(i));

  const typeOptions: SearchSelectOption[] = issueTypes.map((t) => ({
    value: t.name.toLowerCase(),
    label: t.name,
    icon: (
      <TypeIcon type={t.name as IssueType} className="w-3.5 h-3.5 shrink-0" />
    ),
  }));

  const statusOptions: SearchSelectOption[] = statuses.map((s) => ({
    value: s.name.toLowerCase(),
    label: s.name,
    badge: <StatusBadge status={s.name as IssueStatus} />,
  }));

  const priorityOptions: SearchSelectOption[] = PRIORITY_OPTIONS.map((opt) => ({
    value: opt.value,
    label: opt.label,
  }));

  const handleRemoveChild = (childId: string) => {
    setSelectedChildIds((prev) => prev.filter((id) => id !== childId));
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalContent maxWidth="max-w-[1000px]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col h-full"
        >
          <ModalHeader
            title="Create New Issue"
            icon={<FileTextIcon className="w-4 h-4" />}
          />

          <ModalBody>
            <ModalScrollArea className="p-6 flex flex-col gap-6 max-h-[calc(85vh-130px)]">
              {/* Header: Type selector & Summary */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium relative">
                  <div className="relative" ref={typeDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                      className="flex items-center gap-1.5 hover:bg-muted px-2 py-1 -ml-2 rounded-md transition-colors border border-transparent hover:border-border/50 cursor-pointer"
                    >
                      <TypeIcon
                        type={(selectedType || "task") as IssueType}
                        className="w-4 h-4 shrink-0"
                      />
                      <span className="capitalize font-semibold">
                        {(selectedType || "task").toLowerCase()}
                      </span>
                    </button>

                    {isTypeDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-35 bg-card border border-border rounded-lg shadow-lg z-50 flex flex-col py-1.5 animate-in fade-in zoom-in-95 duration-100">
                        {["EPIC", "STORY", "TASK", "SUBTASK", "BUG"].map(
                          (type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => {
                                setValue("type", type.toLowerCase(), {
                                  shouldValidate: true,
                                });
                                setIsTypeDropdownOpen(false);
                              }}
                              className={cn(
                                "flex items-center gap-2.5 px-3 py-1.5 text-[12px] hover:bg-muted text-left w-full transition-colors cursor-pointer",
                                (selectedType || "").toUpperCase() === type &&
                                  "bg-muted/50 font-semibold",
                              )}
                            >
                              <TypeIcon
                                type={type as IssueType}
                                className="w-4 h-4 shrink-0"
                              />
                              <span className="capitalize">
                                {type.toLowerCase()}
                              </span>
                            </button>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                  <span className="text-muted-foreground/40 text-[10px] mx-0.5">
                    •
                  </span>
                  <span className="font-semibold text-primary">New Issue</span>
                  <ErrorTooltip message={errors.type?.message} />
                </div>

                {/* Summary Title Textarea */}
                <div className="relative">
                  <Controller
                    name="summary"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        ref={summaryTextareaRef}
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e);
                          e.target.style.height = "auto";
                          e.target.style.height = `${e.target.scrollHeight}px`;
                        }}
                        placeholder="Issue summary..."
                        rows={1}
                        className="w-full text-xl md:text-2xl font-bold text-foreground leading-tight bg-transparent border-none outline-none resize-none p-0 m-0 focus:ring-0 placeholder:text-muted-foreground/50"
                        spellCheck={false}
                      />
                    )}
                  />
                  <ErrorTooltip message={errors.summary?.message} />
                </div>
              </div>

              {/* Main Grid: Left Main Content + Right Sidebar Properties */}
              <div className="flex flex-col lg:flex-row gap-6 w-full items-start">
                {/* Left Column: Parent Task, Description, Attachments, Subtasks */}
                <div className="flex-1 flex flex-col gap-5 w-full min-w-0">
                  {/* Parent Task */}
                  <div className="flex flex-col items-start gap-1.5 w-full relative">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Parent Task
                    </span>
                    {parentIssue ? (
                      <IssueItemCard
                        issue={parentIssue}
                        onRemove={() =>
                          setValue("parentId", "", { shouldValidate: true })
                        }
                      />
                    ) : (
                      <SearchSelect
                        options={parentOptions}
                        value=""
                        onChange={(val) =>
                          setValue("parentId", val || "", {
                            shouldValidate: true,
                          })
                        }
                        placeholder="Add Parent Task"
                        onSearchChange={setParentSearchQuery}
                      />
                    )}
                    <ErrorTooltip message={errors.parentId?.message} />
                  </div>

                  {/* Description */}
                  <div className="relative flex flex-col gap-1.5">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Description
                    </span>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <TextEditor
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Add a description..."
                        />
                      )}
                    />
                    <ErrorTooltip message={errors.description?.message} />
                  </div>

                  {/* Attachments */}
                  <div className="flex flex-col gap-1.5">
                    <Controller
                      name="attachments"
                      control={control}
                      render={({ field }) => (
                        <FileUploader
                          label="Attachments"
                          value={field.value || []}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>

                  {/* Subtasks / Children Section */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Subtasks / Children
                    </span>
                    <SearchSelect
                      options={subtaskOptions}
                      value=""
                      onChange={(val) => {
                        if (val && !selectedChildIds.includes(val)) {
                          setSelectedChildIds((prev) => [...prev, val]);
                        }
                      }}
                      placeholder="Add or attach subtask..."
                      onSearchChange={setSubtaskSearchQuery}
                    />

                    {selectedChildIssues.length > 0 && (
                      <div className="flex flex-col gap-1.5 p-2 bg-muted/50 rounded-xl border border-border/60 mt-1">
                        {selectedChildIssues.map((child) => (
                          <IssueItemCard
                            key={child.id}
                            issue={child}
                            onRemove={() => handleRemoveChild(child.id)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Properties Sidebar Card */}
                <div className="w-full lg:w-75 shrink-0 flex flex-col gap-4">
                  {/* Type Property */}
                  <div className="flex flex-col gap-1.5 relative">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Type
                    </span>
                    <SearchSelect
                      options={typeOptions}
                      value={selectedType || "task"}
                      onChange={(val) =>
                        setValue("type", val, { shouldValidate: true })
                      }
                      className="h-8 text-[13px] w-full font-medium"
                    />
                  </div>

                  {/* Status Property */}
                  <div className="flex flex-col gap-1.5 relative">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Status
                    </span>
                    <SearchSelect
                      options={statusOptions}
                      value={selectedStatus || "to do"}
                      onChange={(val) =>
                        setValue("status", val, { shouldValidate: true })
                      }
                      className="h-8 text-[13px] w-full font-medium"
                    />
                  </div>

                  {/* Priority Property */}
                  <div className="flex flex-col gap-1.5 relative">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Priority
                    </span>
                    <SearchSelect
                      options={priorityOptions}
                      value={selectedPriority || "medium"}
                      onChange={(val) =>
                        setValue("priority", val, { shouldValidate: true })
                      }
                      className="h-8 text-[13px] w-full font-medium"
                    />
                  </div>

                  {/* Assignee Property */}
                  <div className="flex flex-col gap-1.5 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Assignee
                      </span>
                      {currentUserId && selectedAssigneeId !== currentUserId ? (
                        <button
                          type="button"
                          onClick={() =>
                            setValue("assigneeId", currentUserId, {
                              shouldValidate: true,
                            })
                          }
                          className="text-[10px] font-medium text-primary hover:underline cursor-pointer"
                        >
                          Assign to me
                        </button>
                      ) : null}
                    </div>
                    <Select
                      value={selectedAssigneeId || ""}
                      onChange={(val) =>
                        setValue("assigneeId", val || "", {
                          shouldValidate: true,
                        })
                      }
                      className="h-8 text-[13px] w-full font-medium"
                    >
                      <option value="">Unassigned</option>
                      {members.map((m) => (
                        <option key={m.id} value={m.userId}>
                          {m.username || m.email}
                        </option>
                      ))}
                    </Select>
                  </div>

                  {/* Story Points */}
                  <div className="flex flex-col gap-1.5 relative">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Story Points
                    </span>
                    <div className="grid grid-cols-4 gap-1.5 mt-0.5">
                      {[
                        { label: "?", value: "" },
                        { label: "0", value: "0" },
                        { label: "1/2", value: "0.5" },
                        { label: "1", value: "1" },
                        { label: "2", value: "2" },
                        { label: "3", value: "3" },
                        { label: "5", value: "5" },
                        { label: "8", value: "8" },
                        { label: "10", value: "10" },
                        { label: "13", value: "13" },
                        { label: "20", value: "20" },
                        { label: "40", value: "40" },
                      ].map((pt) => {
                        const isSelected = selectedStoryPoints === pt.value;
                        return (
                          <button
                            key={pt.label}
                            type="button"
                            onClick={() =>
                              setValue("storyPoints", pt.value, {
                                shouldValidate: true,
                              })
                            }
                            className={cn(
                              "flex items-center justify-center h-8 rounded-md border text-[12px] font-bold transition-all cursor-pointer",
                              isSelected
                                ? "bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500 shadow-2xs"
                                : "bg-card border-border text-muted-foreground hover:border-border hover:bg-muted",
                            )}
                          >
                            {pt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Due Date */}
                  <div className="flex flex-col gap-1.5 relative">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Due Date
                    </span>
                    <input
                      type="date"
                      {...register("dueDate")}
                      className="h-8 text-[13px] w-full font-medium bg-card border border-border rounded-md px-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-colors"
                    />
                    <ErrorTooltip message={errors.dueDate?.message} />
                  </div>
                </div>
              </div>
            </ModalScrollArea>
          </ModalBody>

          <ModalFooter>
            <Button
              variant={ButtonVariant.Outline}
              onClick={handleClose}
              disabled={createIssueMutation.isPending}
              type="button"
            >
              Cancel
            </Button>
            <Button
              variant={ButtonVariant.Primary}
              type="submit"
              disabled={!isValid || createIssueMutation.isPending}
            >
              {createIssueMutation.isPending ? "Creating..." : "Create Issue"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
