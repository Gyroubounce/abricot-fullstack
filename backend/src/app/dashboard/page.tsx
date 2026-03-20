"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";
import { useModal } from "@/hooks/useModal";
import { useProjects } from "@/hooks/useProjects";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import TasksSection from "@/components/dashboard/TasksSection";
import CreateProjectModal from "@/components/modals/CreateProjectModal";
import { updateTask as apiUpdateTask } from "@/lib/api/tasks";
import type { User, Task } from "@/types/index";

export default function DashboardPage() {
  const { user } = useAuth();
  const { tasks, projects, loading, error, updateTaskStatus} = useDashboard();
  const { createProject, fetchProjects } = useProjects();
  const { isOpen, openModal, closeModal } = useModal();
  const [view, setView] = useState<"list" | "kanban">("list");

  // 🔥 Fonction requise par TasksSection (édition complète)
  async function handleUpdateTask(taskId: string, data: Partial<Task>) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    await apiUpdateTask(task.projectId, taskId, data);
    
  }

  async function handleCreateProject(
    name: string,
    description: string,
    contributors: User[]
  ) {
    const contributorEmails = contributors.map((u) => u.email);

    const projectId = await createProject(name, description, contributorEmails);
    if (!projectId) return;

    await fetchProjects();
  }

  return (
    <div className="flex flex-col">

      <DashboardHeader
        name={user?.name ?? ""}
        view={view}
        onCreateProject={() => openModal("createProject")}
        onViewChange={setView}
      />

      <TasksSection
        tasks={tasks}
        projects={projects}
        loading={loading}
        error={error}
        view={view}
        onUpdateTaskStatus={updateTaskStatus}
        updateTask={handleUpdateTask}   // 🔥 opérationnel
      />

      {isOpen("createProject") && (
        <CreateProjectModal
          onClose={closeModal}
          onSubmit={handleCreateProject}
        />
      )}

    </div>
  );
}
