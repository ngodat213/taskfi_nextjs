import * as z from "zod";

export const inviteUserSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  jobTitle: z.string().optional(),
  department: z.string().optional(),
  roleId: z.string().min(1, "Role is required"),
  employmentType: z.string().optional(),
  skills: z.string().optional(),
  note: z.string().optional(),
});

export type InviteUserFormData = z.infer<typeof inviteUserSchema>;
