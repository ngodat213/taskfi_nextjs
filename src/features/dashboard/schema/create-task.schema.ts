import { z } from "zod";

export const createTaskSchema = z.object({
  summary: z.string().min(1, "Summary is required"),
  description: z.string().optional(),
  type: z.string().min(1, "Issue Type is required"),
  status: z.string().min(1, "Status is required"),
  priority: z.string().min(1, "Priority is required"),
  assigneeId: z.string().optional(),
  parentId: z.string().optional(),
  dueDate: z.string().optional().nullable(),
  storyPoints: z.string().optional(),
  originalEstimateSeconds: z.string().optional(),
  remainingEstimateSeconds: z.string().optional(),
  attachments: z.array(z.string()).optional(),
});

export type CreateTaskFormValues = z.infer<typeof createTaskSchema>;
