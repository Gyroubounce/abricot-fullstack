"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/hooks/useApi";
import { priorityOrder } from "@/lib/utils/task";
import type { Project, Task, TaskAssignee, TaskWithProject } from "@/types/index";

export function useDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<TaskWithProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data: projectData, error: projectErr } = await apiRequest<{ projects: Project[] }>(
      "/projects"
    );

    if (projectErr || !projectData) {
      setError(projectErr ?? "Erreur lors du chargement");
      setLoading(false);
      return;
    }

    const projectList = projectData.projects;
    setProjects(projectList);

    const taskResults = await Promise.all(
      projectList.map(async (project) => {
        const { data } = await apiRequest<{ tasks: Task[] }>(
          `/projects/${project.id}/tasks`
        );
        return (data?.tasks ?? []).map((task: Task) => ({
          ...task,
          projectName: project.name,
        }));
      })
    );

    const allTasks: TaskWithProject[] = taskResults.flat();
    const myTasks = allTasks
      .filter((task) =>
        task.assignees.some((a: TaskAssignee) => a.user.id === user!.id)
      )
      .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    setTasks(myTasks);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAll();
  }, [user, fetchAll]);

  async function updateTaskStatus(
    taskId: string,
    projectId: string,
    newStatus: TaskWithProject["status"]
  ) {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    const { error: err } = await apiRequest(
      `/projects/${projectId}/tasks/${taskId}`,
      { method: "PUT", body: { status: newStatus } }
    );

    if (err) await fetchAll();
  }

  return { projects, tasks, loading, error, updateTaskStatus };
}