import { z } from "zod";

export const retroCategorySchema = z.enum([
  "went_well",
  "to_improve",
  "action_item",
]);

export const retroCommentSchema = z.object({
  id: z.string().optional(),
  authorName: z.string().min(1, "Author name is required"),
  authorAvatar: z.string().optional(),
  content: z
    .string()
    .min(1, "Comment content cannot be empty")
    .max(2000, "Comment cannot exceed 2000 characters"),
  createdAt: z.string().optional(),
});

export const retroItemSchema = z.object({
  id: z.string().optional(),
  category: retroCategorySchema,
  title: z
    .string()
    .min(1, "Title is required")
    .max(120, "Title must be 120 characters or less"),
  description: z.string().optional(),
  votes: z.number().int().nonnegative().default(0),
  authorName: z.string().min(1, "Author name is required"),
  authorAvatar: z.string().optional(),
  tag: z.string().optional(),
  tags: z.array(z.string()).optional(),
  assigneeName: z.string().optional(),
  assigneeAvatar: z.string().optional(),
  completed: z.boolean().optional(),
  dueDate: z.string().optional(),
  comments: z.array(retroCommentSchema).optional(),
  createdAt: z.string().optional(),
});

export const updateRetroSchema = retroItemSchema.partial();

export const retroSprintSessionSchema = z.object({
  sprintId: z.string().min(1, "Sprint ID is required"),
  sprintName: z.string().min(1, "Sprint name is required"),
  date: z.string().min(1, "Date is required"),
  sentimentScore: z.number().min(0).max(5),
  totalPointsCompleted: z.number().nonnegative(),
  totalPointsPlanned: z.number().nonnegative(),
  items: z.array(retroItemSchema),
});

export type RetroCategorySchema = z.infer<typeof retroCategorySchema>;
export type RetroCommentSchemaValues = z.infer<typeof retroCommentSchema>;
export type RetroItemSchemaValues = z.infer<typeof retroItemSchema>;
export type UpdateRetroSchemaValues = z.infer<typeof updateRetroSchema>;
export type RetroSprintSessionSchemaValues = z.infer<
  typeof retroSprintSessionSchema
>;
