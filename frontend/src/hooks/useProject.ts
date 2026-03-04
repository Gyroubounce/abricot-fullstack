"use client";

import { useState, useCallback } from "react";
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

    try {
      // 1. Fetch projet
      const resProject = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`,
        { credentials: "include" }
      );
      const dataProject = await resProject.json();

      if (!resProject.ok) {
        throw new Error(dataProject.message || "Erreur lors du chargement du projet");
      }

      // 2. Fetch tâches
      const resTasks = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/tasks`,
        { credentials: "include" }
      );
      const dataTasks = await resTasks.json();

      const tasks: Task[] = resTasks.ok ? dataTasks.data.tasks : [];

      setProject({
        ...dataProject.data.project,
        tasks,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur est survenue");
      }
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Modifier le projet
  async function updateProject(name: string, description: string): Promise<void> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, description }),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur lors de la modification");
    await fetchProject();
  }

  // Ajouter un contributeur
  async function addContributor(email: string): Promise<void> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/contributors`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur lors de l'ajout du contributeur");
    await fetchProject();
  }

  // Supprimer un contributeur
  async function removeContributor(userId: string): Promise<void> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/contributors/${userId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur lors de la suppression");
    await fetchProject();
  }

  // Créer une tâche
  async function createTask(
    title: string,
    description: string,
    dueDate: string,
    assigneeIds: string[],
    status: Task["status"],
    priority: Task["priority"]
  ): Promise<void> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/tasks`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, description, dueDate, assigneeIds, status, priority }),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur lors de la création de la tâche");
    await fetchProject();
  }

  // Modifier le statut d'une tâche
  async function updateTaskStatus(
    taskId: string,
    status: Task["status"]
  ): Promise<void> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/tasks/${taskId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur lors de la modification");
    await fetchProject();
  }

  // Supprimer une tâche
  async function deleteTask(taskId: string): Promise<void> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/tasks/${taskId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur lors de la suppression");
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