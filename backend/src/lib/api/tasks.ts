import { apiRequest } from "@/lib/api/client";
import type { Task } from "@/types/index";

export async function createTask(
  projectId: string,
  title: string,
  description: string,
  dueDate: string | null,
  assigneeIds: string[],
  status: Task["status"],      // accepté mais ignoré par le backend
  priority: Task["priority"]
) {
  return apiRequest(`/projects/${projectId}/tasks`, {
    method: "POST",
    body: {
      title,
      description,
      priority,
      dueDate: dueDate || null,   // 🔥 conforme backend
      assigneeIds,                // 🔥 IDs uniquement
    },
  });
}


export async function updateTask(
  projectId: string,
  taskId: string,
  data: Partial<{
    title: string;
    description: string;
    status: Task["status"];
    priority: Task["priority"];
    dueDate: string | null;
    assigneeIds: string[];
  }>
) {
  return apiRequest(`/projects/${projectId}/tasks/${taskId}`, {
    method: "PATCH",   // 🔥 conforme backend
    body: {
      ...data,
      dueDate: data.dueDate || null,   // 🔥 conforme backend
    },
  });
}


export async function deleteTask(projectId: string, taskId: string) {
  return apiRequest(`/projects/${projectId}/tasks/${taskId}`, {
    method: "DELETE",
  });
}

export async function createComment(
  projectId: string,
  taskId: string,
  content: string
) {
  return apiRequest(`/projects/${projectId}/tasks/${taskId}/comments`, {
    method: "POST",
    body: { content },
  });
}
