"use client";

import { useState, useCallback } from "react";
import {
  fetchProject as apiFetchProject,
  fetchProjectTasks,
  updateProject as apiUpdateProject,
  addContributor as apiAddContributor,
  removeContributor as apiRemoveContributor,
} from "@/lib/api/projects";

import { useTask } from "@/hooks/useTask";
import { sanitizeAssigneeIds } from "@/hooks/sanitizeAssignees";

import type { Project, Task, ProjectMember } from "@/types/index";

export type ProjectDetail = Project & {
  tasks: Task[];
};

// ---------------------------------------------------------
// 🔥 Nettoyage des assignees invalides (owner exclu)
// ---------------------------------------------------------
function sanitizeTaskAssignees(tasks: Task[], members: ProjectMember[]): Task[] {
  const memberIds = members.map((m) => m.user.id);

  return tasks.map((task) => ({
    ...task,
    assignees: task.assignees.filter((a) => memberIds.includes(a.user.id)),
  }));
}

export function useProject(projectId: string) {
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    createTaskAPI,
    updateTaskAPI,
    deleteTaskAPI,
  } = useTask();

  // ---------------------------------------------------------
  // FETCH PROJECT + TASKS
  // ---------------------------------------------------------
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

    const safeMembers = projectData.project.members ?? [];
    const safeTasks = sanitizeTaskAssignees(taskData?.tasks ?? [], safeMembers);

    setProject({
      ...projectData.project,
      members: safeMembers,
      tasks: safeTasks,
    });

    setLoading(false);
  }, [projectId]);

  // ---------------------------------------------------------
  // CREATE TASK (logique métier)
  // ---------------------------------------------------------
  async function createTask(
    title: string,
    description: string,
    dueDate: string,
    assigneeIds: string[],
    status: Task["status"],
    priority: Task["priority"]
  ) {
    if (!project) return;

    const safeAssignees = sanitizeAssigneeIds(assigneeIds, project.members);

    const isoDate =
      dueDate && dueDate.trim() !== ""
        ? new Date(dueDate).toISOString()
        : null;

    await createTaskAPI(projectId, {
      title,
      description,
      dueDate: isoDate,
      assigneeIds: safeAssignees,
      status,
      priority,
    });

    await fetchProject();
  }

  // ---------------------------------------------------------
  // UPDATE TASK (logique métier)
  // ---------------------------------------------------------
  async function updateTask(
    taskId: string,
    data: Partial<Task> & { assigneeIds?: string[] }
  ) {
    if (!project) return;

    const safeAssignees = data.assigneeIds
      ? sanitizeAssigneeIds(data.assigneeIds, project.members)
      : undefined;

    await updateTaskAPI(projectId, taskId, {
      ...data,
      ...(safeAssignees ? { assigneeIds: safeAssignees } : {}),
    });

    await fetchProject();
  }

  // ---------------------------------------------------------
  // DELETE TASK
  // ---------------------------------------------------------
  async function deleteTask(taskId: string) {
    await deleteTaskAPI(projectId, taskId);
    await fetchProject();
  }

  return {
    project,
    loading,
    error,
    fetchProject,
    updateProject: apiUpdateProject,
    addContributor: apiAddContributor,
    removeContributor: apiRemoveContributor,
    createTask,
    updateTask,
    deleteTask,
  };
}
