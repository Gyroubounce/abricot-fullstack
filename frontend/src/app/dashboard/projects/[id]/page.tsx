"use client";


import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useProject } from "@/hooks/useProject";
import { useAuth } from "@/hooks/useAuth";
import { useModal } from "@/hooks/useModal";
import { getInitials } from "@/lib/utils/initials";
import { priorityOrder } from "@/lib/utils/task";
import TaskCard from "@/components/projects/TaskCard";
import EditProjectModal from "@/components/modals/EditProjectModal";
import CreateTaskModal from "@/components/modals/CreateTaskModal";
import AITaskModal from "@/components/modals/AITaskModal";
import type { Task } from "@/types/index";
import Button from "@/components/ui/Button";
import IAIcon from "@/components/ui/icons/IAIcon";
import ListIcon from "@/components/ui/icons/ListIcon";
import KanbanIcon from "@/components/ui/icons/CalenderIcon";

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
    updateTaskStatus,
    deleteTask,
  } = useProject(id);
  const { isOpen, openModal, closeModal } = useModal();
  const [view, setView] = useState<"list" | "calendar">("list");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const filteredTasks = (project?.tasks ?? [])
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
        : priorityOrder[a.priority] - priorityOrder[b.priority]
    );

  async function handleAISubmit(
    aiTasks: { title: string; description: string; priority: Task["priority"] }[]
  ) {
    await Promise.all(
      aiTasks.map((t) => createTask(t.title, t.description, "", [], "TODO", t.priority))
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

  const isOwner = project.owner.id === user?.id;

  return (
    <div className="flex flex-col gap-6">

   {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/dashboard/projects")}
              className="w-14 h-14 flex items-center justify-center border border-system-neutral rounded-md bg-bg-content hover:bg-bg-grey-light transition"
              aria-label="Retour aux projets"
            >
              <ArrowLeftIcon className="h-4 w-4 text-text-primary" />
            </button>

            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-3">
                <h1 className="font-semibold text-[24px] text-text-primary">
                  {project.name}
                </h1>
                {isOwner && (
                  <button
                    type="button"
                    onClick={() => openModal("editProject")}
                    className="text-sm text-brand-dark underline hover:text-btn-black transition"
                  >
                    modifier
                  </button>
                )}
              </div>
              {project.description && (
                <p className="text-[18px] text-text-secondary">
                  {project.description}
                </p>
              )}
            </div>
          </div>
      
        {/* Boutons Créer une tâche + IA */}
        <div className="flex items-center gap-2 shrink-0">
        <Button variant="creer-tache" onClick={() => openModal("createTask")} ariaLabel="Créer une nouvelle tâche">
          Créer une tâche
        </Button>

          <button
            type="button"
            onClick={() => openModal("aiTask")}
            className="flex items-center justify-center gap-1 w-23.5 h-12.5 bg-brand-dark text-text-white text-sm  rounded-[10px] hover:bg-bg-content hover:text-brand-dark border border-brand-dark transition"
            aria-label="Générer des tâches avec l'IA"
          >
           <IAIcon className="w-4 h-4 shrink-0" aria-hidden="true" />
            IA
          </button>
        </div>
      </div>

      {/* Contributeurs */}
      <section
        className="bg-bg-grey-light rounded-[10px] px-8 py-3"
        aria-labelledby="contributors-title"
      >
        <div className="flex items-center justify-between gap-4">
          <h2
            id="contributors-title"
            className="font-semibold text-text-primary text-lg"
          >
            Contributeurs{" "}
            <span className="text-base text-text-secondary ml-1">
              {project.members.length + 1} personnes
            </span>
          </h2>

          <ul className="flex flex-row flex-wrap gap-3" aria-label="Liste des contributeurs">

            {/* Propriétaire */}
            <li className="flex items-center gap-2">
              <div
                className="w-6.75 h-6.75 rounded-full bg-brand-light flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                <span className="text-[10px]  text-text-btn-black">
                  {getInitials(project.owner.name)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                
                <span className="text-sm text-brand-dark bg-brand-light px-2 py-0.5 rounded-full">
                  Propriétaire
                </span>
              </div>
            </li>

            {/* Contributeurs */}
            {project.members.map((member) => (
              <li key={member.id} className="flex items-center gap-2">
                <div
                  className="w-6.75 h-6.75 rounded-full bg-system-neutral border border-system-neutral flex items-center justify-center shrink-0"
                  aria-hidden="true"
                >
                  <span className="text-[10px]  text-text-btn-black">
                    {getInitials(member.user.name)}
                  </span>
                </div>
                <span className="text-sm text-text-secondary bg-system-neutral px-2 py-0.5 rounded-full">
                  {member.user.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Tâches */}
      <section
        className="bg-bg-content rounded-[10px] shadow-card px-6 py-5 flex flex-col gap-4"
        aria-labelledby="tasks-title"
      >
        <div className="flex flex-col">
          <h2
            id="tasks-title"
            className="font-semibold text-text-primary text-lg"
          >
            Tâches
          </h2>

          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-base text-text-secondary">
              {view === "list" ? "Par ordre de priorité" : "Par ordre d'échéance"}
            </p>

            <div className="flex items-center gap-2 flex-wrap">

              {/* Vue Liste / Calendrier */}
              <div className="flex gap-3" role="group" aria-label="Mode d'affichage">
                <button
                  type="button"
                  onClick={() => setView("list")}
                  aria-pressed="false"
                  className={`px-4 py-2 w-23.5 h-11.25 rounded-md flex items-center gap-3 text-sm transition  ${
                    view === "list"
                      ? "bg-brand-light text-brand-dark"
                      : "bg-white text-brand-dark  hover:bg-brand-light"
                  }`}
                >
                  <ListIcon className="w-4 h-4" aria-hidden="true" />
                  Liste
                </button>
                <button
                  type="button"
                  onClick={() => setView("calendar")}
                  aria-pressed="false"
                  className={`px-3 py-2 rounded-md flex items-center gap-3 text-sm transition  ${
                    view === "calendar"
                      ? "bg-brand-light text-brand-dark"
                      : "bg-white text-brand-dark hover:bg-brand-light"
                  }`}
                >
                  <KanbanIcon className="w-5 h-5 shrink-0" aria-hidden="true" />
                  Calendrier
                </button>
              </div>

              {/* Filtre statut */}
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                  className="w-38 h-15.75 text-sm border border-system-neutral rounded-md bg-bg-content text-text-secondary transition  pr-8 text-center appearance-none cursor-pointer"
                  aria-label="Filtrer par statut"
                >
                  <option value="ALL">Statut</option>
                  <option value="TODO">À faire</option>
                  <option value="IN_PROGRESS">En cours</option>
                  <option value="DONE">Terminée</option>
                  <option value="CANCELLED">Annulée</option>
                </select>

                {/* Flèche custom — même couleur que le texte */}
                <svg
                  className="absolute right-5 top-1/2 -translate-y-1/2 h-7 w-7 text-text-secondary pointer-events-none"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={0.8}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 8l5 5 5-5" />
                </svg>
              </div>
              {/* Recherche */}
              <div className="relative">
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher une tâche"
                  className="w-70.75 h-15.75 pl-6 pr-8 py-1.5 text-xs border border-system-neutral rounded-md bg-bg-content text-text-primary transition"
                  aria-label="Rechercher une tâche"
                />
                <MagnifyingGlassIcon
                  className="absolute right-8 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-secondary pointer-events-none"
                  aria-hidden="true"
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
                  ownerId={project.owner.id}
                  task={task}
                  onDelete={deleteTask}
                  onEdit={(t) => {
                    setEditingTask(t);
                    openModal("editTask");
                  }}
                  onStatusChange={updateTaskStatus}
                  onRefresh={fetchProject}
                />
              </li>
            ))}
          </ul>
        )}

      </section>

      {/* Modales */}
      {isOpen("editProject") && (
        <EditProjectModal
          initialName={project.name}
          initialDescription={project.description ?? ""}
          initialMembers={project.members}
          ownerId={project.owner.id}
          onClose={closeModal}
          onSubmit={updateProject}
          onAddContributor={addContributor}
          onRemoveContributor={removeContributor}
        />
      )}

      {isOpen("createTask") && (
        <CreateTaskModal
          members={project.members}
          ownerId={project.owner.id}
          onClose={closeModal}
          onSubmit={(title, description, dueDate, assigneeIds, status) =>
      createTask(title, description, dueDate, assigneeIds, status, "MEDIUM")
    }
        />
      )}

      {isOpen("editTask") && editingTask && (
        <CreateTaskModal
          members={project.members}
          ownerId={project.owner.id}
          initialTask={editingTask}
          onClose={() => {
            closeModal();
            setEditingTask(null);
          }}
          onSubmit={async (title, description, dueDate, assigneeIds, status) => {
            await updateTaskStatus(editingTask.id, status);
            closeModal();
            setEditingTask(null);
          }}
        />
      )}

      {isOpen("aiTask") && (
        <AITaskModal
          onClose={closeModal}
          onSubmit={handleAISubmit}
        />
      )}

    </div>
  );
}