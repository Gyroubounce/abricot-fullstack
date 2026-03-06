"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import StarAI from "@/app/assets/Star_AI.png";
import StarFocus from "@/app/assets/Star_focus.png";
import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  ListBulletIcon,
  CalendarIcon,
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
  const [aiHover, setAiHover] = useState(false);
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
            className="w-8 h-8 flex items-center justify-center border border-system-neutral rounded-md bg-bg-content hover:bg-bg-grey-light transition"
            aria-label="Retour aux projets"
          >
            <ArrowLeftIcon className="h-4 w-4 text-text-primary" />
          </button>

          <div className="flex flex-col gap-0.5">
            <h1 className="font-semibold text-[24px] text-text-primary">
              {project.name}
            </h1>
            {isOwner && (
              <button
                type="button"
                onClick={() => openModal("editProject")}
                className="text-xs text-brand-dark underline hover:text-btn-black transition self-start"
              >
                modifier
              </button>
            )}
            {project.description && (
              <p className="text-[18px] text-text-secondary mt-1">
                {project.description}
              </p>
            )}
          </div>
        </div>

        {/* Boutons Créer une tâche + IA */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => openModal("createTask")}
            className="px-4 py-2 bg-btn-black text-text-white text-sm rounded-md hover:text-brand-dark hover:bg-bg-content border border-brand-dark transition"
          >
            Créer une tâche
          </button>

          <button
            type="button"
            onClick={() => openModal("aiTask")}
            onMouseEnter={() => setAiHover(true)}
            onMouseLeave={() => setAiHover(false)}
            onFocus={() => setAiHover(true)}
            onBlur={() => setAiHover(false)}
            className="flex items-center gap-1.5 px-3 py-2  bg-brand-dark text-text-white text-sm  rounded-md hover:bg-bg-content hover:text-brand-dark border border-brand-dark transition"
            aria-label="Générer des tâches avec l'IA"
          >
            <Image
              src={aiHover ? StarAI : StarFocus}
              alt=""
              width={16}
              height={16}
              aria-hidden="true"
            />
            IA
          </button>
        </div>
      </div>

      {/* Contributeurs */}
      <section
        className="bg-bg-grey-light rounded-[8px] px-6 py-5"
        aria-labelledby="contributors-title"
      >
        <div className="flex items-center justify-between gap-4">
          <h2
            id="contributors-title"
            className="font-semibold text-text-primary text-base"
          >
            Contributeurs{" "}
            <span className="text-text-secondary font-normal">
              {project.members.length + 1} personnes
            </span>
          </h2>

          <ul className="flex flex-row flex-wrap gap-3" aria-label="Liste des contributeurs">

            {/* Propriétaire */}
            <li className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                <span className="text-xs font-semibold text-text-primary">
                  {getInitials(project.owner.name)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                
                <span className="text-xs text-brand-dark bg-brand-light px-2 py-0.5 rounded-full">
                  Propriétaire
                </span>
              </div>
            </li>

            {/* Contributeurs */}
            {project.members.map((member) => (
              <li key={member.id} className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full bg-system-neutral border border-system-neutral flex items-center justify-center shrink-0"
                  aria-hidden="true"
                >
                  <span className="text-xs font-semibold text-text-primary">
                    {getInitials(member.user.name)}
                  </span>
                </div>
                <span className="text-sm text-text-primary bg-system-neutral px-2 py-0.5 rounded-full">
                  {member.user.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Tâches */}
      <section
        className="bg-bg-content rounded-[8px] shadow-card px-6 py-5 flex flex-col gap-4"
        aria-labelledby="tasks-title"
      >
        <div className="flex flex-col gap-4">
          <h2
            id="tasks-title"
            className="font-semibold text-text-primary text-base"
          >
            Tâches
          </h2>

          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-xs text-text-secondary">
              {view === "list" ? "Par ordre de priorité" : "Par ordre d'échéance"}
            </p>

            <div className="flex items-center gap-2 flex-wrap">

              {/* Vue Liste / Calendrier */}
              <div className="flex gap-1" role="group" aria-label="Mode d'affichage">
                <button
                  type="button"
                  onClick={() => setView("list")}
                  aria-pressed={view === "list" ? ("true" as const) : ("false" as const)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition ${
                    view === "list"
                      ? "bg-brand-light text-brand-dark"
                      : "bg-white text-brand-dark hover:border border-brand-dark"
                  }`}
                >
                  <ListBulletIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  Liste
                </button>
                <button
                  type="button"
                  onClick={() => setView("calendar")}
                  aria-pressed={view === "calendar" ? ("true" as const) : ("false" as const)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition ${
                    view === "calendar"
                      ? "bg-brand-light text-brand-dark"
                      : "bg-white text-brand-dark hover:border border-brand-dark"
                  }`}
                >
                  <CalendarIcon className="h-3.5 w-3.5" aria-hidden="true" />
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
                <MagnifyingGlassIcon
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-secondary pointer-events-none"
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
          onClose={closeModal}
          onSubmit={updateProject}
          onAddContributor={addContributor}
          onRemoveContributor={removeContributor}
        />
      )}

      {isOpen("createTask") && (
        <CreateTaskModal
          members={project.members}
          onClose={closeModal}
          onSubmit={createTask}
        />
      )}

      {isOpen("editTask") && editingTask && (
        <CreateTaskModal
          members={project.members}
          initialTask={editingTask}
          onClose={() => {
            closeModal();
            setEditingTask(null);
          }}
          onSubmit={async (title, description, dueDate, assigneeIds, status, priority) => {
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