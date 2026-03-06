"use client";

import { useState, useCallback } from "react";
import {
  fetchProject as apiFetchProject,
  fetchProjectTasks,
  updateProject as apiUpdateProject,
  addContributor as apiAddContributor,
  removeContributor as apiRemoveContributor,
} from "@/lib/api/projects";
import {
  createTask as apiCreateTask,
  updateTask as apiUpdateTask,
  deleteTask as apiDeleteTask,
} from "@/lib/api/tasks";
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

    const { data: projectData, error: projectErr } = await apiFetchProject(projectId);

    if (projectErr || !projectData) {
      setError(projectErr ?? "Projet introuvable");
      setLoading(false);
      return;
    }

    const { data: taskData } = await fetchProjectTasks(projectId);

    setProject({
      ...projectData.project,
      tasks: taskData?.tasks ?? [],
    });

    setLoading(false);
  }, [projectId]);

  async function updateProject(name: string, description: string): Promise<void> {
    const { error: err } = await apiUpdateProject(projectId, name, description);
    if (err) throw new Error(err);
    await fetchProject();
  }

  async function addContributor(email: string): Promise<void> {
    const { error: err } = await apiAddContributor(projectId, email);
    if (err) throw new Error(err);
    await fetchProject();
  }

  async function removeContributor(userId: string): Promise<void> {
    const { error: err } = await apiRemoveContributor(projectId, userId);
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
    const { error: err } = await apiCreateTask(
      projectId, title, description, dueDate, assigneeIds, status, priority
    );
    if (err) throw new Error(err);
    await fetchProject();
  }

  async function updateTaskStatus(taskId: string, status: Task["status"]): Promise<void> {
    const { error: err } = await apiUpdateTask(projectId, taskId, { status });
    if (err) throw new Error(err);
    await fetchProject();
  }

  async function deleteTask(taskId: string): Promise<void> {
    const { error: err } = await apiDeleteTask(projectId, taskId);
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