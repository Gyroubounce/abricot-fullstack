"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";
import { useModal } from "@/hooks/useModal";
import { useProjects } from "@/hooks/useProjects";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import TasksSection from "@/components/dashboard/TasksSection";
import CreateProjectModal from "@/components/modals/CreateProjectModal";
import type { User } from "@/types/index";

export default function DashboardPage() {
  const { user } = useAuth();
  const { tasks, projects, loading, error, updateTaskStatus } = useDashboard();
  const { createProject, addContributor, fetchProjects } = useProjects();
  const { isOpen, openModal, closeModal } = useModal();
  const [view, setView] = useState<"list" | "kanban">("list");

  async function handleCreateProject(
    name: string,
    description: string,
    contributors: User[]
  ) {
    const projectId = await createProject(name, description);
    if (!projectId) return;
    await Promise.all(contributors.map((u) => addContributor(projectId, u.email)));
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