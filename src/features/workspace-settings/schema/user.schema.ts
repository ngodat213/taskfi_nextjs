import * as z from "zod";

export const inviteUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  location: z.string().optional(),
  jobTitle: z.string().optional(),
  departmentId: z.string().optional(),
  roleId: z.string().min(1, "Role is required"),
  employmentTypeId: z.string().optional(),
  skills: z.string().optional(),
  personalNote: z.string().optional(),
});

export type InviteUserFormData = z.infer<typeof inviteUserSchema>;
