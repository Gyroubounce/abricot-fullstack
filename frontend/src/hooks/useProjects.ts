"use client";

import { useState, useCallback } from "react";
import type { Project, Task } from "@/types/index";

export type ProjectWithStats = Project & {
  tasks: Task[];
  completedTasks: number;
  totalTasks: number;
  progression: number;
};

export function useProjects() {
  const [projects, setProjects] = useState<ProjectWithStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Récupérer tous les projets
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erreur lors du chargement des projets");
      }

      const projectList: Project[] = data.data.projects;

      // 2. Récupérer les tâches de chaque projet en parallèle
      const projectsWithStats = await Promise.all(
        projectList.map(async (project) => {
          const resTasks = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/projects/${project.id}/tasks`,
            { credentials: "include" }
          );

          if (!resTasks.ok) {
            return {
              ...project,
              tasks: [],
              completedTasks: 0,
              totalTasks: 0,
              progression: 0,
            };
          }

          const dataTasks = await resTasks.json();
          const tasks: Task[] = dataTasks.data.tasks;
          const completedTasks = tasks.filter((t) => t.status === "DONE").length;
          const totalTasks = tasks.length;
          const progression = totalTasks > 0
            ? Math.round((completedTasks / totalTasks) * 100)
            : 0;

          return {
            ...project,
            tasks,
            completedTasks,
            totalTasks,
            progression,
          };
        })
      );

      setProjects(projectsWithStats);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur est survenue");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Créer un projet
  async function createProject(name: string, description: string): Promise<string | null> {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, description }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erreur lors de la création du projet");
      }

      // Retourne l'id du projet créé pour pouvoir ajouter les contributeurs
      return data.data.project.id;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw new Error("Une erreur est survenue");
    }
  }

  // Ajouter un contributeur
  async function addContributor(projectId: string, email: string): Promise<void> {
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

    if (!res.ok) {
      throw new Error(data.message || "Erreur lors de l'ajout du contributeur");
    }
  }

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    addContributor,
  };
}