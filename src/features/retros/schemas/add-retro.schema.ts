import { z } from "zod";

export const addRetroSchema = z.object({
  category: z.enum(["went_well", "to_improve", "action_item"]),
  title: z
    .string()
    .min(1, "Title is required")
    .max(120, "Title must be 120 characters or less"),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  tag: z.string().optional(),
});

export type AddRetroFormValues = z.infer<typeof addRetroSchema>;

export const DEFAULT_ADD_RETRO_VALUES: AddRetroFormValues = {
  category: "went_well",
  title: "",
  description: "",
  tags: ["General"],
  tag: "General",
};
