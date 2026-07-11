import * as z from "zod";

export const employmentTypeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export type EmploymentTypeFormData = z.infer<typeof employmentTypeSchema>;
