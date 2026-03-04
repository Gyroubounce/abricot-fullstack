import { apiRequest } from "@/lib/api/client";
import type { Task } from "@/types/index";

export async function createTask(
  projectId: string,
  title: string,
  description: string,
  dueDate: string,
  assigneeIds: string[],
  status: Task["status"],
  priority: Task["priority"]
) {
  return apiRequest(`/projects/${projectId}/tasks`, {
    method: "POST",
    body: { title, description, dueDate, assigneeIds, status, priority },
  });
}

export async function updateTask(
  projectId: string,
  taskId: string,
  data: Partial<Pick<Task, "title" | "description" | "dueDate" | "status" | "priority">> & {
    assigneeIds?: string[];
  }
) {
  return apiRequest(`/projects/${projectId}/tasks/${taskId}`, {
    method: "PUT",
    body: data,
  });
}

export async function deleteTask(projectId: string, taskId: string) {
  return apiRequest(`/projects/${projectId}/tasks/${taskId}`, {
    method: "DELETE",
  });
}