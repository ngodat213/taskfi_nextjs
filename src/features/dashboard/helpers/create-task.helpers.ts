import { CreateTaskFormValues } from "@/features/dashboard/schema/create-task.schema";

export const DEFAULT_CREATE_TASK_VALUES: CreateTaskFormValues = {
  summary: "",
  description: "",
  type: "task",
  status: "to do",
  priority: "medium",
  assigneeId: "",
  parentId: "",
  storyPoints: "",
  originalEstimateSeconds: "",
  remainingEstimateSeconds: "",
  dueDate: "",
  attachments: [],
};

export const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

export const formatCreateTaskPayload = (data: CreateTaskFormValues) => ({
  ...data,
  assigneeId: data.assigneeId || undefined,
  parentId: data.parentId || undefined,
  storyPoints: data.storyPoints ? Number(data.storyPoints) : 0,
  originalEstimateSeconds: data.originalEstimateSeconds
    ? Number(data.originalEstimateSeconds)
    : 0,
  remainingEstimateSeconds: data.remainingEstimateSeconds
    ? Number(data.remainingEstimateSeconds)
    : 0,
  dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
  links: [],
  attachments: data.attachments || [],
});
