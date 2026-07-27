import { z } from "zod";

export const createProjectSchema = z.object({
  key: z.string().min(1, "Key is required"),
  name: z.string().min(1, "Name is required"),
  projectType: z.string().optional(),
  description: z.string().optional(),
  logoPublicId: z.string().optional(),
  leadId: z.string().optional(),
  groupId: z.string().min(1, "Group is required"),
});

export type CreateProjectFormData = z.infer<typeof createProjectSchema>;
