"use client";

import { useState, useCallback } from "react";
import { apiRequest } from "@/hooks/useApi";
import type { Project, Task } from "@/types/index";

export type ProjectDetail = Project & {
  tasks: Task[];
};

export function useProject(projectId: string) {
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data: projectData, error: projectErr } = await apiRequest<{ project: Project }>(
      `/projects/${projectId}`
    );

    if (projectErr || !projectData) {
      setError(projectErr ?? "Projet introuvable");
      setLoading(false);
      return;
    }

    const { data: taskData } = await apiRequest<{ tasks: Task[] }>(
      `/projects/${projectId}/tasks`
    );

    setProject({
      ...projectData.project,
      tasks: taskData?.tasks ?? [],
    });

    setLoading(false);
  }, [projectId]);

  async function updateProject(name: string, description: string): Promise<void> {
    const { error: err } = await apiRequest(`/projects/${projectId}`, {
      method: "PUT",
      body: { name, description },
    });
    if (err) throw new Error(err);
    await fetchProject();
  }

  async function addContributor(email: string): Promise<void> {
    const { error: err } = await apiRequest(
      `/projects/${projectId}/contributors`,
      { method: "POST", body: { email } }
    );
    if (err) throw new Error(err);
    await fetchProject();
  }

  async function removeContributor(userId: string): Promise<void> {
    const { error: err } = await apiRequest(
      `/projects/${projectId}/contributors/${userId}`,
      { method: "DELETE" }
    );
    if (err) throw new Error(err);
    await fetchProject();
  }

  async function createTask(
    title: string,
    description: string,
    dueDate: string,
    assigneeIds: string[],
    status: Task["status"],
    priority: Task["priority"]
  ): Promise<void> {
    const { error: err } = await apiRequest(
      `/projects/${projectId}/tasks`,
      {
        method: "POST",
        body: { title, description, dueDate, assigneeIds, status, priority },
      }
    );
    if (err) throw new Error(err);
    await fetchProject();
  }

  async function updateTaskStatus(taskId: string, status: Task["status"]): Promise<void> {
    const { error: err } = await apiRequest(
      `/projects/${projectId}/tasks/${taskId}`,
      { method: "PUT", body: { status } }
    );
    if (err) throw new Error(err);
    await fetchProject();
  }

  async function deleteTask(taskId: string): Promise<void> {
    const { error: err } = await apiRequest(
      `/projects/${projectId}/tasks/${taskId}`,
      { method: "DELETE" }
    );
    if (err) throw new Error(err);
    await fetchProject();
  }

  return {
    project,
    loading,
    error,
    fetchProject,
    updateProject,
    addContributor,
    removeContributor,
    createTask,
    updateTaskStatus,
    deleteTask,
  };
}