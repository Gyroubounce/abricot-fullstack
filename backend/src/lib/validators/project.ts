import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(1, "Le titre est requis").max(100, "Le titre est trop long"),
  description: z.string().max(500, "La description est trop longue").optional(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;