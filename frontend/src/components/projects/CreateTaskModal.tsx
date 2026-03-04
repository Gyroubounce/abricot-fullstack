"use client";

import { useState, useRef, useEffect } from "react";
import { XMarkIcon, CalendarIcon, MagnifyingGlassIcon, XCircleIcon } from "@heroicons/react/24/outline";
import type { Task, User, ProjectMember } from "@/types/index";

const statusOptions: { value: Task["status"]; label: string }[] = [
  { value: "TODO", label: "À faire" },
  { value: "IN_PROGRESS", label: "En cours" },
  { value: "DONE", label: "Terminée" },
];

const priorityOptions: { value: Task["priority"]; label: string }[] = [
  { value: "LOW", label: "Basse" },
  { value: "MEDIUM", label: "Moyenne" },
  { value: "HIGH", label: "Haute" },
  { value: "URGENT", label: "Urgente" },
];

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

type Props = {
  members: ProjectMember[];
  onClose: () => void;
  onSubmit: (
    title: string,
    description: string,
    dueDate: string,
    assigneeIds: string[],
    status: Task["status"],
    priority: Task["priority"]
  ) => Promise<void>;
};

export default function CreateTaskModal({ members, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<Task["status"]>("TODO");
  const [priority, setPriority] = useState<Task["priority"]>("MEDIUM");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Recherche parmi les membres du projet uniquement
  useEffect(() => {
    if (!query || query.length < 1) {
      setResults([]);
      return;
    }

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(() => {
      const filtered = members
        .map((m) => m.user)
        .filter(
          (u) =>
            !selectedAssignees.some((a) => a.id === u.id) &&
            (u.name.toLowerCase().includes(query.toLowerCase()) ||
              u.email.toLowerCase().includes(query.toLowerCase()))
        );
      setResults(filtered);
      setSearching(false);
    }, 200);
  }, [query, members, selectedAssignees]);

  function addAssignee(user: User) {
    setSelectedAssignees((prev) => [...prev, user]);
    setQuery("");
    setResults([]);
  }

  function removeAssignee(userId: string) {
    setSelectedAssignees((prev) => prev.filter((u) => u.id !== userId));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onSubmit(
        title,
        description,
        dueDate,
        selectedAssignees.map((u) => u.id),
        status,
        priority
      );
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-task-title"
      onClick={onClose}
    >
      <div
        className="bg-bg-content rounded-[8px] shadow-modal w-full max-w-[598px] max-h-[90vh] overflow-y-auto p-6 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2
            id="create-task-title"
            className="font-manrope font-semibold text-text-primary text-lg"
          >
            Créer une tâche
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition"
            aria-label="Fermer la modale"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

          {/* Titre */}
          <div className="flex flex-col gap-1">
            <label htmlFor="task-title" className="text-sm font-medium text-text-primary">
              Titre <span aria-hidden="true">*</span>
            </label>
            <input
              id="task-title"
              ref={firstInputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-system-neutral rounded-[8px] px-4 py-2.5 text-sm text-text-primary bg-bg-content transition"
              placeholder="Titre de la tâche"
              aria-required="true"
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label htmlFor="task-description" className="text-sm font-medium text-text-primary">
              Description <span aria-hidden="true">*</span>
            </label>
            <textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-system-neutral rounded-[8px] px-4 py-2.5 text-sm text-text-primary bg-bg-content transition resize-none"
              placeholder="Description de la tâche"
              rows={3}
              aria-required="true"
              required
            />
          </div>

          {/* Échéance */}
          <div className="flex flex-col gap-1">
            <label htmlFor="task-due-date" className="text-sm font-medium text-text-primary">
              Échéance <span aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <input
                id="task-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-system-neutral rounded-[8px] px-4 py-2.5 pr-11 text-sm text-text-primary bg-bg-content transition"
                aria-required="true"
                required
              />
              <CalendarIcon
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Assigné à */}
          <div className="flex flex-col gap-2">
            <label htmlFor="task-assignee-search" className="text-sm font-medium text-text-primary">
              Assigné à
            </label>

            {selectedAssignees.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedAssignees.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-1.5 bg-bg-grey-light px-2.5 py-1 rounded-full"
                  >
                    <div className="w-5 h-5 rounded-full bg-brand-light flex items-center justify-center">
                      <span className="text-[10px] font-semibold text-text-primary">
                        {getInitials(user.name)}
                      </span>
                    </div>
                    <span className="text-xs text-text-primary">{user.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAssignee(user.id)}
                      className="text-text-secondary hover:text-system-error transition"
                      aria-label={`Retirer ${user.name}`}
                    >
                      <XCircleIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="relative">
              <MagnifyingGlassIcon
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary"
                aria-hidden="true"
              />
              <input
                id="task-assignee-search"
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSearching(true);
                }}
                className="w-full border border-system-neutral rounded-[8px] pl-9 pr-4 py-2.5 text-sm text-text-primary bg-bg-content transition"
                placeholder="Rechercher un membre du projet"
                autoComplete="off"
              />

              {(results.length > 0 || searching) && (
                <ul
                  className="absolute z-10 w-full mt-1 bg-bg-content border border-system-neutral rounded-[8px] shadow-modal overflow-hidden"
                  role="listbox"
                  aria-label="Membres du projet"
                >
                  {searching && query.length > 0 && results.length === 0 && (
                    <li className="px-4 py-2.5 text-sm text-text-secondary">
                      Recherche...
                    </li>
                  )}
                  {results.map((user) => (
                    <li key={user.id} role="option" aria-selected="false">
                      <button
                        type="button"
                        onClick={() => addAssignee(user)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-bg-grey-light transition text-left"
                      >
                        <div className="w-7 h-7 rounded-full bg-bg-grey-light flex items-center justify-center shrink-0">
                          <span className="text-xs font-semibold text-text-primary">
                            {getInitials(user.name)}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-text-primary">{user.name}</span>
                          <span className="text-xs text-text-secondary">{user.email}</span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Statut */}
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-text-primary">Statut</span>
            <div className="flex gap-2 flex-wrap" role="group" aria-label="Statut de la tâche">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value)}
                  aria-pressed={status === opt.value ? "true" : "false"}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                    status === opt.value
                      ? "bg-btn-black text-text-white"
                      : "bg-bg-grey-light text-text-secondary hover:bg-system-neutral"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Priorité */}
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-text-primary">Priorité</span>
            <div className="flex gap-2 flex-wrap" role="group" aria-label="Priorité de la tâche">
              {priorityOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPriority(opt.value)}
                  aria-pressed={priority === opt.value ? "true" : "false"}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                    priority === opt.value
                      ? "bg-btn-black text-text-white"
                      : "bg-bg-grey-light text-text-secondary hover:bg-system-neutral"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Erreur */}
          {error && (
            <p role="alert" aria-live="assertive" className="text-sm text-system-error">
              {error}
            </p>
          )}

          {/* Bouton */}
          <button
            type="submit"
            disabled={loading || !title.trim() || !description.trim() || !dueDate}
            className="mt-2 w-full py-2.5 bg-btn-black text-text-white text-sm font-medium rounded-[8px] hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Création en cours..." : "+ Ajouter une tâche"}
          </button>

        </form>
      </div>
    </div>
  );
}