"use client";

import { useState, useEffect } from "react";
import { CalendarIcon } from "@heroicons/react/24/outline";
import ContributorSearch from "@/components/ui/ContributorSearch";
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

type Props = {
  initialTask?: Partial<Task>;
  members: ProjectMember[];
  submitLabel: string;
  loading: boolean;
  error: string | null;
  onSubmit: (
    title: string,
    description: string,
    dueDate: string,
    assigneeIds: string[],
    status: Task["status"],
    priority: Task["priority"]
  ) => Promise<void>;
};

export default function TaskForm({
  initialTask,
  members,
  submitLabel,
  loading,
  error,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState(initialTask?.title ?? "");
  const [description, setDescription] = useState(initialTask?.description ?? "");
  const [dueDate, setDueDate] = useState(
    initialTask?.dueDate ? initialTask.dueDate.split("T")[0] : ""
  );
  const [status, setStatus] = useState<Task["status"]>(initialTask?.status ?? "TODO");
  const [priority, setPriority] = useState<Task["priority"]>(initialTask?.priority ?? "MEDIUM");
  const [selectedAssignees, setSelectedAssignees] = useState<User[]>([]);

  // Pré-remplir les assignés si édition
  useEffect(() => {
    if (initialTask?.assignees) {
      setSelectedAssignees(initialTask.assignees.map((a) => a.user));
    }
  }, [initialTask]);

  function addAssignee(user: User) {
    setSelectedAssignees((prev) => [...prev, user]);
  }

  function removeAssignee(userId: string) {
    setSelectedAssignees((prev) => prev.filter((u) => u.id !== userId));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit(
      title,
      description,
      dueDate,
      selectedAssignees.map((u) => u.id),
      status,
      priority
    );
  }

  // Membres filtrés pour ContributorSearch (membres du projet uniquement)
  const memberUsers: User[] = members.map((m) => m.user);
  const excludeUserIds = selectedAssignees.map((u) => u.id);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

      {/* Titre */}
      <div className="flex flex-col gap-1">
        <label htmlFor="task-title" className="text-sm font-medium text-text-primary">
          Titre <span aria-hidden="true">*</span>
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-system-neutral rounded-[8px] px-4 py-2.5 text-sm text-text-primary bg-bg-content transition"
          placeholder="Titre de la tâche"
          aria-required="true"
          required
          autoFocus
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

      {/* Assigné à — recherche parmi les membres du projet */}
      <ContributorSearch
        selectedUsers={selectedAssignees}
        excludeUserIds={excludeUserIds}
        onAdd={addAssignee}
        onRemove={removeAssignee}
        label="Assigné à"
        placeholder="Rechercher un membre du projet"
        // Surcharge : recherche locale parmi les membres uniquement
        localUsers={memberUsers}
      />

      {/* Statut */}
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-text-primary">Statut</span>
        <div className="flex gap-2 flex-wrap" role="group" aria-label="Statut de la tâche">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setStatus(opt.value)}
              aria-pressed={status === opt.value ? ("true" as const) : ("false" as const)}
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
              aria-pressed={priority === opt.value ? ("true" as const) : ("false" as const)}
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
        {loading ? "En cours..." : submitLabel}
      </button>

    </form>
  );
}