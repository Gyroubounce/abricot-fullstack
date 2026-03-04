"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
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

    try {
      // 1. Récupérer tous les projets
      const resProjects = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/projects`,
        { credentials: "include" }
      );
      const dataProjects = await resProjects.json();

      if (!resProjects.ok) {
        throw new Error(dataProjects.message || "Erreur lors du chargement des projets");
      }

      const projectList: Project[] = dataProjects.data.projects;
      setProjects(projectList);

      // 2. Récupérer les tâches de chaque projet en parallèle
      const taskResults = await Promise.all(
        projectList.map(async (project) => {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/projects/${project.id}/tasks`,
            { credentials: "include" }
          );
          if (!res.ok) return [];
          const data = await res.json();
          return data.data.tasks.map((task: Task) => ({
            ...task,
            projectName: project.name,
          }));
        })
      );

      // 3. Aplatir et filtrer les tâches assignées à l'utilisateur connecté
      const allTasks: TaskWithProject[] = taskResults.flat();
      const myTasks = allTasks.filter((task) =>
        task.assignees.some((a: TaskAssignee) => a.userId === user!.id)
      );

      setTasks(myTasks);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur est survenue");
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetchAll();
  }, [user, fetchAll]);

  async function updateTaskStatus(
    taskId: string,
    projectId: string,
    newStatus: TaskWithProject["status"]
  ) {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/tasks/${taskId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) {
        await fetchAll();
      }
    } catch {
      await fetchAll();
    }
  }

  return { projects, tasks, loading, error, updateTaskStatus };
}