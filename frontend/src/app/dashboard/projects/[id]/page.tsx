"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useProject } from "@/hooks/useProject";
import { useAuth } from "@/hooks/useAuth";
import TaskCard from "@/components/projects/TaskCard";
import EditProjectModal from "@/components/projects/EditProjectModal";
import CreateTaskModal from "@/components/projects/CreateTaskModal";
import AITaskModal from "@/components/projects/AITaskModal";
import type { Task } from "@/types/index";

type View = "list" | "calendar";
type FilterStatus = Task["status"] | "ALL";

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

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
    updateTaskStatus,
    deleteTask,
  } = useProject(id);

  const [view, setView] = useState<View>("list");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  // Filtrage + tri tâches
  const priorityOrder: Record<Task["priority"], number> = {
    URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3,
  };

  const filteredTasks = (project?.tasks ?? [])
    .filter((task) => {
      const matchSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "ALL" || task.status === filterStatus;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  // Créer tâches IA
  async function handleAISubmit(
    aiTasks: { title: string; description: string; priority: Task["priority"] }[]
  ) {
    await Promise.all(
      aiTasks.map((t) =>
        createTask(t.title, t.description, "", [], "TODO", t.priority)
      )
    );
  }

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

  const owner = project.members.find((m) => m.role === "OWNER");
  const contributors = project.members.filter((m) => m.role !== "OWNER");
  const isOwner = owner?.user.id === user?.id;

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">

        {/* Gauche : retour + titre + modifier */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard/projects")}
            className="w-8 h-8 flex items-center justify-center border border-system-neutral rounded-md bg-bg-content hover:bg-bg-grey-light transition"
            aria-label="Retour aux projets"
          >
            <ArrowLeftIcon className="h-4 w-4 text-text-primary" />
          </button>

          <div className="flex flex-col gap-0.5">
            <h1 className="font-manrope font-semibold text-[24px] text-text-primary">
              {project.name}
            </h1>
            {isOwner && (
              <button
                type="button"
                onClick={() => setShowEditModal(true)}
                className="text-xs text-brand-dark underline hover:opacity-80 transition self-start"
              >
                modifier
              </button>
            )}
          </div>
        </div>

        {/* Droite : boutons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowAIModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 border border-system-neutral bg-bg-content text-text-primary text-sm font-medium rounded-md hover:bg-bg-grey-light transition"
            aria-label="Générer des tâches avec l'IA"
          >
            <SparklesIcon className="h-4 w-4 text-brand-dark" aria-hidden="true" />
            IA
          </button>

          <button
            type="button"
            onClick={() => setShowCreateTaskModal(true)}
            className="px-4 py-2 bg-btn-black text-text-white text-sm font-medium rounded-md hover:opacity-90 transition"
          >
            Créer une tâche
          </button>
        </div>
      </div>

      {/* Contributeurs */}
      <section
        className="bg-bg-grey-light rounded-[8px] px-6 py-5 flex flex-col gap-4"
        aria-labelledby="contributors-title"
      >
        <h2
          id="contributors-title"
          className="font-manrope font-semibold text-text-primary text-base"
        >
          Contributeurs ({project.members.length})
        </h2>

        <ul className="flex flex-col gap-3" aria-label="Liste des contributeurs">

          {/* Propriétaire */}
          {owner && (
            <li className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                <span className="text-xs font-semibold text-text-primary">
                  {getInitials(owner.user.name)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-text-primary">
                  {owner.user.name}
                </span>
                <span className="text-xs text-brand-dark bg-brand-light px-2 py-0.5 rounded-full w-fit">
                  Propriétaire
                </span>
              </div>
            </li>
          )}

          {/* Contributeurs */}
          {contributors.map((member) => (
            <li key={member.id} className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full bg-bg-grey-light border border-system-neutral flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                <span className="text-xs font-semibold text-text-primary">
                  {getInitials(member.user.name)}
                </span>
              </div>
              <span className="text-sm text-text-primary">{member.user.name}</span>
            </li>
          ))}

        </ul>
      </section>

      {/* Tâches */}
      <section
        className="bg-bg-content rounded-[8px] shadow-card px-6 py-5 flex flex-col gap-4"
        aria-labelledby="tasks-title"
      >

        {/* En-tête tâches */}
        <div className="flex flex-col gap-4">
          <h2
            id="tasks-title"
            className="font-manrope font-semibold text-text-primary text-base"
          >
            Tâches
          </h2>

          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-xs text-text-secondary">Par ordre de priorité</p>

            {/* Contrôles */}
            <div className="flex items-center gap-2 flex-wrap">

              {/* Vue liste / calendrier */}
              <div className="flex gap-1" role="group" aria-label="Mode d'affichage">
                <button
                  type="button"
                  onClick={() => setView("list")}
                  aria-pressed={view === "list" ? "true" : "false"}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                    view === "list"
                      ? "bg-btn-black text-text-white"
                      : "bg-bg-grey-light text-text-secondary hover:bg-system-neutral"
                  }`}
                >
                  Liste
                </button>
                <button
                  type="button"
                  onClick={() => setView("calendar")}
                  aria-pressed={view === "calendar" ? "true" : "false"}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                    view === "calendar"
                      ? "bg-btn-black text-text-white"
                      : "bg-bg-grey-light text-text-secondary hover:bg-system-neutral"
                  }`}
                >
                  Calendrier
                </button>
              </div>

              {/* Filtre statut */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                className="text-xs border border-system-neutral rounded-md px-3 py-1.5 bg-bg-content text-text-primary transition"
                aria-label="Filtrer par statut"
              >
                <option value="ALL">Statut</option>
                <option value="TODO">À faire</option>
                <option value="IN_PROGRESS">En cours</option>
                <option value="DONE">Terminée</option>
                <option value="CANCELLED">Annulée</option>
              </select>

              {/* Recherche */}
              <div className="relative">
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher une tâche"
                  className="pl-4 pr-8 py-1.5 text-xs border border-system-neutral rounded-md bg-bg-content text-text-primary w-48 transition"
                  aria-label="Rechercher une tâche"
                />
              </div>

            </div>
          </div>
        </div>

        {/* Liste tâches */}
        {filteredTasks.length === 0 ? (
          <p className="text-sm text-text-secondary py-4">
            Aucune tâche pour le moment.
          </p>
        ) : (
          <ul className="flex flex-col gap-3" aria-label="Liste des tâches">
            {filteredTasks.map((task) => (
              <li key={task.id}>
                <TaskCard
                  task={task}
                  onDelete={(taskId) => deleteTask(taskId)}
                  onEdit={(task) => setEditingTask(task)}
                  onStatusChange={(taskId, status) => updateTaskStatus(taskId, status)}
                />
              </li>
            ))}
          </ul>
        )}

      </section>

      {/* Modales */}
      {showEditModal && (
        <EditProjectModal
          initialName={project.name}
          initialDescription={project.description ?? ""}
          initialMembers={project.members}
          onClose={() => setShowEditModal(false)}
          onSubmit={updateProject}
          onAddContributor={addContributor}
          onRemoveContributor={removeContributor}
        />
      )}

      {showCreateTaskModal && (
        <CreateTaskModal
          members={project.members}
          onClose={() => setShowCreateTaskModal(false)}
          onSubmit={createTask}
        />
      )}

      {editingTask && (
        <CreateTaskModal
          members={project.members}
          onClose={() => setEditingTask(null)}
          onSubmit={async (title, description, dueDate, assigneeIds, status, priority) => {
            await updateTaskStatus(editingTask.id, status);
            setEditingTask(null);
          }}
        />
      )}

      {showAIModal && (
        <AITaskModal
          onClose={() => setShowAIModal(false)}
          onSubmit={handleAISubmit}
        />
      )}

    </div>
  );
}