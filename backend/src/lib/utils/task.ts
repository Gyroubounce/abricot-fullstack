import type { Task } from "@/types/index";

export const statusLabel: Record<Task["status"], string> = {
  TODO: "À faire",
  IN_PROGRESS: "En cours",
  DONE: "Terminée",
  CANCELLED: "Annulée",
};

export const statusColor: Record<Task["status"], string> = {
  TODO: "bg-system-error text-text-error",
  IN_PROGRESS: "bg-brand-light text-brand-dark",
  DONE: "bg-system-success text-text-success",
  CANCELLED: "bg-system-neutral text-text-secondary",
};

export const priorityLabel: Record<Task["priority"], string> = {
  LOW: "Basse",
  MEDIUM: "Moyenne",
  HIGH: "Haute",
  URGENT: "Urgente",
};

export const priorityOrder: Record<Task["priority"], number> = {
  URGENT: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};