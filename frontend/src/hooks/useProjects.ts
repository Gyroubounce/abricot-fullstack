"use client";

import { useState, useCallback } from "react";
import { apiRequest } from "@/hooks/useApi";
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

    const { data, error: err } = await apiRequest<{ projects: Project[] }>("/projects");

    if (err || !data) {
      setError(err ?? "Erreur lors du chargement des projets");
      setLoading(false);
      return;
    }

    const projectsWithStats = await Promise.all(
      data.projects.map(async (project) => {
        const { data: taskData } = await apiRequest<{ tasks: Task[] }>(
          `/projects/${project.id}/tasks`
        );

        const tasks: Task[] = taskData?.tasks ?? [];
        const completedTasks = tasks.filter((t) => t.status === "DONE").length;
        const totalTasks = tasks.length;
        const progression = totalTasks > 0
          ? Math.round((completedTasks / totalTasks) * 100)
          : 0;

        return { ...project, tasks, completedTasks, totalTasks, progression };
      })
    );

    setProjects(projectsWithStats);
    setLoading(false);
  }, []);

  async function createProject(name: string, description: string): Promise<string | null> {
    const { data, error: err } = await apiRequest<{ project: Project }>("/projects", {
      method: "POST",
      body: { name, description },
    });

    if (err || !data) throw new Error(err ?? "Erreur lors de la création");
    return data.project.id;
  }

  async function addContributor(projectId: string, email: string): Promise<void> {
    const { error: err } = await apiRequest(
      `/projects/${projectId}/contributors`,
      { method: "POST", body: { email } }
    );
    if (err) throw new Error(err);
  }

  return { projects, loading, error, fetchProjects, createProject, addContributor };
}