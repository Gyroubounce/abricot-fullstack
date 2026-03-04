"use client";

import { useDashboard } from "@/hooks/useDashboard";
import { useState } from "react";
import TasksSection from "@/components/dashboard/TasksSection";

export default function TasksPage() {
  const { tasks, projects,loading, error, updateTaskStatus } = useDashboard();
  const [view, setView] = useState<"list" | "kanban">("list");

  return (
    <div className="flex flex-col gap-8">

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-[28px] font-semibold text-text-primary">
            Mes tâches
          </h1>
          <p className="text-sm text-text-secondary">
            Toutes vos tâches assignées
          </p>
        </div>
      </div>

      <TasksSection
        tasks={tasks}
        projects={projects}
        loading={loading}
        error={error}
        view={view}
        onUpdateTaskStatus={updateTaskStatus}
      />

    </div>
  );
}