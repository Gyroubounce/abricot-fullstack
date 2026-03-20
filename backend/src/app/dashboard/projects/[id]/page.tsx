"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useProjects } from "@/hooks/useProjects";
import { useProject } from "@/hooks/useProject";
import { useAuth } from "@/hooks/useAuth";
import { useModal } from "@/hooks/useModal";

import ProjectHeader from "@/components/project/ProjectHeader";
import ProjectFilters from "@/components/project/ProjectFilters";
import ProjectTaskList from "@/components/project/ProjectTaskList";

import EditProjectModal from "@/components/modals/EditProjectModal";
import CreateTaskModal from "@/components/modals/CreateTaskModal";
import EditTaskModal from "@/components/modals/EditTaskModal";
import AITaskModal from "@/components/modals/AITaskModal";

import type { Task } from "@/types";

type FilterStatus = Task["status"] | "ALL";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const {
    project,
    loading,
    error,
    fetchProject,
    updateProject,
    addContributor,
    removeContributor,
    createTask,
    updateTask,
    deleteTask,
  } = useProject(id);

  const { deleteProject } = useProjects();
  const { isOpen, openModal, closeModal } = useModal();

  const [view, setView] = useState<"list" | "calendar">("list");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  if (loading) {
    return (
      <p role="status" aria-live="polite" className="text-sm text-text-secondary">
        Chargement du projet...
      </p>
    );
  }

  if (error || !project) {
    return (
      <p role="alert" aria-live="assertive" className="text-sm text-system-error">
        {error ?? "Projet introuvable."}
      </p>
    );
  }

  const isOwner = project.owner.id === user?.id;
  
  const projectContributors =
    project.members
      ?.filter((m) => m.user.id !== project.owner.id)
      .map((m) => m.user) || [];

  const totalContributors = 1 + projectContributors.length;

  const filteredTasks = (project.tasks ?? [])
    .filter((task) => {
      const matchSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "ALL" || task.status === filterStatus;
      return matchSearch && matchStatus;
    })
    .sort((a, b) =>
      view === "calendar"
        ? new Date(a.dueDate ?? "").getTime() - new Date(b.dueDate ?? "").getTime()
        : a.priority.localeCompare(b.priority)
    );

  async function handleAISubmit(
    aiTasks: { title: string; description: string; priority: Task["priority"] }[]
  ) {
    await Promise.all(
      aiTasks.map((t) =>
        createTask(t.title, t.description, "", [], "TODO", t.priority)
      )
    );
  }

  async function handleUpdateTask(
    title: string,
    description: string,
    dueDate: string | null,
    assigneeIds: string[],
    status: Task["status"],
    priority: Task["priority"]
  ) {
    if (!editingTask) return;

    await updateTask(editingTask.id, {
      title,
      description,
      dueDate: dueDate ?? undefined,
      assigneeIds,
      status,
      priority,
    });

    closeModal();
    setEditingTask(null);
  }

  return (
    <div className="flex flex-col gap-6">

      <ProjectHeader
        project={project}
        isOwner={isOwner}
        onBack={() => router.push("/dashboard/projects")}
        onEditProject={() => openModal("editProject")}
        onCreateTask={() => openModal("createTask")}
        onCreateAITask={() => openModal("aiTask")}
      />

      <ProjectFilters
        view={view}
        setView={setView}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        search={search}
        setSearch={setSearch}
      />

      <ProjectTaskList
        tasks={filteredTasks}
        ownerId={project.owner.id}
        onEditTask={(t: Task) => {
          const fullTask = project.tasks.find((task) => task.id === t.id);
          setEditingTask(fullTask || t);
          openModal("editTask");
        }}
        onDeleteTask={deleteTask}
        onStatusChange={(taskId, status) =>
          updateTask(taskId, { status })
        }
        onRefresh={fetchProject}
      />

      {isOpen("editProject") && (
        <EditProjectModal
          projectId={id}
          initialName={project.name}
          initialDescription={project.description ?? ""}
          initialMembers={project.members}
          ownerId={project.owner.id}
          projectContributors={projectContributors}
          totalContributors={totalContributors}
          onClose={closeModal}
          onSubmit={async (projectId, name, description) => {
            await updateProject(projectId, name, description);
          }}
          onAddContributor={async (projectId, email) => {
            await addContributor(projectId, email);
          }}
          onRemoveContributor={async (projectId, userId) => {
            await removeContributor(projectId, userId);
          }}
          onDelete={async (projectId) => {
            await deleteProject(projectId);
            router.push("/dashboard/projects");
          }}
          onRefresh={fetchProject}
        />
      )}


      {isOpen("createTask") && (
        <CreateTaskModal
          members={project.members}
          ownerId={project.owner.id}
          onClose={closeModal}
          onSubmit={(title, description, dueDate, assigneeIds, status, priority) =>
            createTask(title, description, dueDate ?? "", assigneeIds, status, priority)
          }
        />
      )}

      {isOpen("editTask") && editingTask && (
        <EditTaskModal
          task={editingTask}
          members={project.members}
          ownerId={project.owner.id}
          onClose={() => {
            closeModal();
            setEditingTask(null);
          }}
          onSubmit={handleUpdateTask}
        />
      )}

      {isOpen("aiTask") && (
        <AITaskModal onClose={closeModal} onSubmit={handleAISubmit} />
      )}
    </div>
  );
}
