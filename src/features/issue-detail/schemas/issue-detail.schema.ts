import { z } from "zod";

export const updateIssueSchema = z.object({
  summary: z.string().min(1, "Tiêu đề không được để trống").optional(),
  type: z.string().optional(),
  status: z.string().optional(),
  description: z
    .string()
    .max(10000, "Mô tả không được vượt quá 10,000 ký tự")
    .nullable()
    .optional(),
  assigneeId: z.string().nullable().optional(),
  reporterId: z.string().nullable().optional(),
  priority: z.string().optional(),
  parentId: z.string().nullable().optional(),
  sprintId: z.string().nullable().optional(),
  storyPoints: z.number().min(0).nullable().optional(),
  originalEstimateSeconds: z.number().min(0).nullable().optional(),
  remainingEstimateSeconds: z.number().min(0).nullable().optional(),
  timeSpentSeconds: z.number().min(0).nullable().optional(),
  dueDate: z.string().nullable().optional(),
  links: z.array(z.unknown()).optional(),
  attachments: z.array(z.unknown()).optional(),
});

export const updateIssueMainSchema = updateIssueSchema.pick({
  parentId: true,
  description: true,
});

export type UpdateIssueSchema = z.infer<typeof updateIssueSchema>;
export type UpdateIssueMainSchema = z.infer<typeof updateIssueMainSchema>;
