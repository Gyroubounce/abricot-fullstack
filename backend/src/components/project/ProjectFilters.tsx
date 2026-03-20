"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import ListIcon from "@/components/ui/icons/ListIcon";
import KanbanIcon from "@/components/ui/icons/CalenderIcon";
import type { Task } from "@/types";

type FilterStatus = Task["status"] | "ALL";

type ProjectFiltersProps = {
  view: "list" | "calendar";
  setView: (v: "list" | "calendar") => void;

  filterStatus: FilterStatus;
  setFilterStatus: (s: FilterStatus) => void;

  search: string;
  setSearch: (s: string) => void;
};

export default function ProjectFilters({
  view,
  setView,
  filterStatus,
  setFilterStatus,
  search,
  setSearch,
}: ProjectFiltersProps) {
  return (
    <section
      className="bg-bg-content rounded-[10px] shadow-card px-6 py-5 flex flex-col gap-4"
      aria-labelledby="tasks-title"
    >
      <div className="flex flex-col">
        <h2 id="tasks-title" className="font-semibold text-text-primary text-lg">
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
                className={`px-4 py-2 w-23.5 h-11.25 rounded-md flex items-center gap-3 text-sm transition ${
                  view === "list"
                    ? "bg-brand-light text-brand-dark"
                    : "bg-white text-brand-dark hover:bg-brand-light"
                }`}
              >
                <ListIcon className="w-4 h-4" aria-hidden="true" />
                Liste
              </button>

              <button
                type="button"
                onClick={() => setView("calendar")}
                className={`px-3 py-2 rounded-md flex items-center gap-3 text-sm transition ${
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
                className="w-38 h-15.75 text-sm border border-system-neutral rounded-md bg-bg-content text-text-secondary transition pr-8 text-center appearance-none cursor-pointer"
                aria-label="Filtrer par statut"
              >
                <option value="ALL">Statut</option>
                <option value="TODO">À faire</option>
                <option value="IN_PROGRESS">En cours</option>
                <option value="DONE">Terminée</option>
                <option value="CANCELLED">Annulée</option>
              </select>

              <svg
                className="absolute right-7 top-1/2 -translate-y-1/2 h-7 w-7 text-text-secondary pointer-events-none"
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
    </section>
  );
}
