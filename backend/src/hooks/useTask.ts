"use client";

import { useState } from "react";
import { apiRequest } from "@/hooks/useApi";
import type { Task } from "@/types/index";

type CreateTaskPayload = {
  title: string;
  description: string;
  dueDate: string | null;
  assigneeIds: string[];
  status: Task["status"];
  priority: Task["priority"];
};

export function useTask() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------------------------------------------------------
  // CREATE TASK (API only)
  // ---------------------------------------------------------
  async function createTaskAPI(projectId: string, data: CreateTaskPayload) {
    setLoading(true);
    setError(null);

    const { error: err } = await apiRequest(`/projects/${projectId}/tasks`, {
      method: "POST",
      body: data,
    });

    if (err) {
      setError(err);
      setLoading(false);
      return null;
    }

    setLoading(false);
    return true;
  }

  // ---------------------------------------------------------
  // UPDATE TASK (API only)
  // ---------------------------------------------------------
  async function updateTaskAPI(
    projectId: string,
    taskId: string,
    data: Partial<Task> & { assigneeIds?: string[] }
  ) {
    setLoading(true);
    setError(null);

    const { error: err } = await apiRequest(
      `/projects/${projectId}/tasks/${taskId}`,
      {
        method: "PUT",
        body: data,
      }
    );

    if (err) {
      setError(err);
      setLoading(false);
      return null;
    }

    setLoading(false);
    return true;
  }

  // ---------------------------------------------------------
  // DELETE TASK (API only)
  // ---------------------------------------------------------
  async function deleteTaskAPI(projectId: string, taskId: string) {
    setLoading(true);
    setError(null);

    const { error: err } = await apiRequest(
      `/projects/${projectId}/tasks/${taskId}`,
      {
        method: "DELETE",
      }
    );

    if (err) {
      setError(err);
      setLoading(false);
      return null;
    }

    setLoading(false);
    return true;
  }

  return {
    loading,
    error,
    createTaskAPI,
    updateTaskAPI,
    deleteTaskAPI,
  };
}
