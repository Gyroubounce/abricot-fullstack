import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Le titre est requis").max(100, "Le titre est trop long"),
  description: z.string().min(1, "La description est requise").max(1000, "La description est trop longue"),
  dueDate: z.string().min(1, "L'échéance est requise"),
  assigneeIds: z.array(z.string()).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE", "CANCELLED"]).default("TODO"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
});

export type TaskFormValues = z.infer<typeof taskSchema>;