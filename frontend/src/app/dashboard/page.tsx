"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";
import TaskCardList from "@/components/dashboard/TaskCardList";
import KanbanColumn from "@/components/dashboard/KanbanColumn";
import Taches from "@/app/assets/Taches.png";
import Kanban from "@/app/assets/Kanban.png";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { TaskWithProject } from "@/types/index";

type View = "list" | "kanban";

const COLUMNS: { id: TaskWithProject["status"]; label: string }[] = [
  { id: "TODO", label: "À faire" },
  { id: "IN_PROGRESS", label: "En cours" },
  { id: "DONE", label: "Terminées" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { tasks, loading, error, updateTaskStatus } = useDashboard();
  const [view, setView] = useState<View>("list");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<TaskWithProject["status"] | "ALL">("ALL");
  const [filterPriority, setFilterPriority] = useState<TaskWithProject["priority"] | "ALL">("ALL");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filtrage
  const filteredTasks = tasks.filter((task) => {
    const matchSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description?.toLowerCase().includes(search.toLowerCase()) ||
      task.projectName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "ALL" || task.status === filterStatus;
    const matchPriority = filterPriority === "ALL" || task.priority === filterPriority;
    return matchSearch && matchStatus && matchPriority;
  });

  // Tri par priorité
  const priorityOrder: Record<TaskWithProject["priority"], number> = {
    URGENT: 0,
    HIGH: 1,
    MEDIUM: 2,
    LOW: 3,
  };
  const sortedTasks = [...filteredTasks].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  // Drag & drop
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const task = tasks.find((t) => t.id === active.id);
    const newStatus = over.id as TaskWithProject["status"];

    if (task && task.status !== newStatus) {
      updateTaskStatus(task.id, task.projectId, newStatus);
    }
  }

  const firstName = user?.name?.split(" ")[0] || "";

  return (
    <div className="flex flex-col gap-8">

      {/* Titre + bouton */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-[28px] font-semibold text-text-primary">
            Tableau de bord
          </h1>
          <p className="text-sm text-text-secondary">
            Bonjour {firstName}, voici un aperçu de vos projets et tâches.
          </p>
        </div>

        <button
          className="px-4 py-2 rounded-md bg-brand-dark text-white font-manrope text-sm hover:opacity-90 transition"
          aria-label="Créer un nouveau projet"
        >
          + Créer un projet
        </button>
      </div>

      {/* Boutons Liste / Kanban */}
      <div className="flex gap-3" role="group" aria-label="Mode d'affichage">

        <button
          onClick={() => setView("list")}
          aria-pressed={view === "list" ? ("true" as const) : ("false" as const)}
          className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm transition ${
            view === "list"
              ? "bg-brand-light text-brand-dark font-medium"
              : "bg-bg-content text-text-secondary hover:bg-brand-light hover:text-brand-dark"
          }`}
        >
          <Image src={Taches} alt="" width={18} height={18} aria-hidden="true" />
          Liste
        </button>

        <button
          onClick={() => setView("kanban")}
          aria-pressed={view === "kanban" ? "true" : "false"}
          className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm transition ${
            view === "kanban"
              ? "bg-brand-light text-brand-dark font-medium"
              : "bg-bg-content text-text-secondary hover:bg-brand-light hover:text-brand-dark"
          }`}
        >
          <Image src={Kanban} alt="" width={18} height={18} aria-hidden="true" />
          Kanban
        </button>

      </div>

      {/* Section Mes tâches */}
      <section aria-labelledby="tasks-title">

        {/* En-tête section */}
        <div className="bg-bg-content rounded-[8px] shadow-card px-6 py-5 flex flex-col gap-4">

          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex flex-col gap-0.5">
              <h2
                id="tasks-title"
                className="text-[20px] font-manrope font-semibold text-text-primary"
              >
                Mes tâches assignées
              </h2>
              <p className="text-xs text-text-secondary">Par ordre de priorité</p>
            </div>

            {/* Search + Filtres */}
            <div className="flex items-center gap-3 flex-wrap">

              {/* Search */}
              <div className="relative">
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher une tâche..."
                  className="pl-4 pr-4 py-2 text-sm border border-system-neutral rounded-[8px] bg-bg-content text-text-primary w-56 transition"
                  aria-label="Rechercher une tâche"
                />
              </div>

              {/* Filtre statut */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                className="text-sm border border-system-neutral rounded-[8px] px-3 py-2 bg-bg-content text-text-primary transition"
                aria-label="Filtrer par statut"
              >
                <option value="ALL">Tous les statuts</option>
                <option value="TODO">À faire</option>
                <option value="IN_PROGRESS">En cours</option>
                <option value="DONE">Terminées</option>
                <option value="CANCELLED">Annulées</option>
              </select>

              {/* Filtre priorité */}
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as typeof filterPriority)}
                className="text-sm border border-system-neutral rounded-[8px] px-3 py-2 bg-bg-content text-text-primary transition"
                aria-label="Filtrer par priorité"
              >
                <option value="ALL">Toutes les priorités</option>
                <option value="URGENT">Urgente</option>
                <option value="HIGH">Haute</option>
                <option value="MEDIUM">Moyenne</option>
                <option value="LOW">Basse</option>
              </select>

            </div>
          </div>

          {/* États loading / erreur / vide */}
          {loading && (
            <p role="status" aria-live="polite" className="text-sm text-text-secondary py-4">
              Chargement des tâches...
            </p>
          )}

          {!loading && error && (
            <p role="alert" aria-live="assertive" className="text-sm text-system-error py-4">
              {error}
            </p>
          )}

          {!loading && !error && sortedTasks.length === 0 && (
            <p className="text-sm text-text-secondary py-4">
              Aucune tâche assignée pour le moment.
            </p>
          )}

          {/* Vue Liste */}
          {!loading && !error && view === "list" && sortedTasks.length > 0 && (
            <div className="flex flex-col gap-3" role="list" aria-label="Liste des tâches">
              {sortedTasks.map((task) => (
                <div key={task.id} role="listitem">
                  <TaskCardList task={task} />
                </div>
              ))}
            </div>
          )}

          {/* Vue Kanban */}
          {!loading && !error && view === "kanban" && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <div
                className="grid grid-cols-3 gap-4"
                role="region"
                aria-label="Vue Kanban"
              >
                {COLUMNS.map((col) => (
                  <KanbanColumn
                    key={col.id}
                    id={col.id}
                    title={`${col.label} (${sortedTasks.filter((t) => t.status === col.id).length})`}
                    tasks={sortedTasks.filter((t) => t.status === col.id)}
                  />
                ))}
              </div>
            </DndContext>
          )}

        </div>
      </section>

    </div>
  );
}