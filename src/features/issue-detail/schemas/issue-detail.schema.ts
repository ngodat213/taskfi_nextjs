import { z } from "zod";

export const updateIssueMainSchema = z.object({
  parentId: z.string().nullable().optional(),
  description: z
    .string()
    .max(10000, "Mô tả không được vượt quá 10,000 ký tự")
    .nullable()
    .optional(),
});

export type UpdateIssueMainSchema = z.infer<typeof updateIssueMainSchema>;
