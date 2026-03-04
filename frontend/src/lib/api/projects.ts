import { apiRequest } from "@/lib/api/client";
import type { Project, Task } from "@/types/index";

export async function fetchProjects() {
  return apiRequest<{ projects: Project[] }>("/projects");
}

export async function fetchProject(projectId: string) {
  return apiRequest<{ project: Project }>(`/projects/${projectId}`);
}

export async function createProject(name: string, description: string) {
  return apiRequest<{ project: Project }>("/projects", {
    method: "POST",
    body: { name, description },
  });
}

export async function updateProject(
  projectId: string,
  name: string,
  description: string
) {
  return apiRequest(`/projects/${projectId}`, {
    method: "PUT",
    body: { name, description },
  });
}

export async function deleteProject(projectId: string) {
  return apiRequest(`/projects/${projectId}`, {
    method: "DELETE",
  });
}

export async function addContributor(projectId: string, email: string) {
  return apiRequest(`/projects/${projectId}/contributors`, {
    method: "POST",
    body: { email },
  });
}

export async function removeContributor(projectId: string, userId: string) {
  return apiRequest(`/projects/${projectId}/contributors/${userId}`, {
    method: "DELETE",
  });
}

export async function fetchProjectTasks(projectId: string) {
  return apiRequest<{ tasks: Task[] }>(`/projects/${projectId}/tasks`);
}