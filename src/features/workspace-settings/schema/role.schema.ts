import * as z from "zod";

export const createRoleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  permissions: z.array(z.string()),
});

export type CreateRoleFormData = z.infer<typeof createRoleSchema>;
