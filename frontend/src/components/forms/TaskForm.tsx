"use client";

import { getUsers } from "@/lib/api/users";
import { useEffect, useState } from "react";
import { getInitials } from "@/lib/utils/initials";
import { statusLabel, statusColor } from "@/lib/utils/task";
import type { Task, User, ProjectMember } from "@/types/index";

const statusOptions = (Object.entries(statusLabel) as [Task["status"], string][]).filter(
  ([value]) => value !== "CANCELLED"
);

type Props = {
  initialTask?: Partial<Task>;
  members?: ProjectMember[];
  ownerId?: string;
  submitLabel: string;
  loading: boolean;
  error: string | null;
  onSubmit: (
    title: string,
    description: string,
    dueDate: string,
    assigneeIds: string[],
    status: Task["status"]
  ) => Promise<void>;
};

export default function TaskForm({
  initialTask,
  ownerId,
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
  const [status, setStatus] = useState<Task["status"] | null>(initialTask?.status ?? null);
  const [assigneeOpen, setAssigneeOpen] = useState(false);
  const [selectedAssignees, setSelectedAssignees] = useState<User[]>(
    initialTask?.assignees?.map((a) => a.user) ?? []
  );
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    getUsers().then((users) => setAllUsers(users));
  }, []);

  function addAssignee(user: User) {
    setSelectedAssignees((prev) => [...prev, user]);
    setAssigneeOpen(false);
  }

  function removeAssignee(userId: string) {
    setSelectedAssignees((prev) => prev.filter((u) => u.id !== userId));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!status) return;
    await onSubmit(
      title,
      description,
      dueDate,
      selectedAssignees.map((u) => u.id),
      status
    );
  }

  const availableUsers = allUsers.filter(
    (u) => !selectedAssignees.find((a) => a.id === u.id)
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

      <div className="w-113 h-133.75 mx-auto overflow-y-auto flex flex-col gap-4 pr-1">

        {/* Titre */}
        <div className="flex flex-col gap-1">
          <label htmlFor="task-title" className="text-sm text-text-primary">
            Titre <span aria-hidden="true">*</span>
          </label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-13.25 border border-system-neutral rounded-sm px-4 py-3 text-sm text-text-primary bg-bg-content transition"
            placeholder="Titre de la tâche"
            aria-required="true"
            required
            autoFocus
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label htmlFor="task-description" className="text-sm text-text-primary">
            Description <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="task-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-13.25 border border-system-neutral rounded-sm px-4 py-3 text-sm text-text-primary bg-bg-content transition resize-none"
            placeholder="Description de la tâche"
            rows={3}
            aria-required="true"
            required
          />
        </div>

        {/* Échéance */}
        <div className="flex flex-col gap-1">
          <label htmlFor="task-due-date" className="text-sm text-text-primary">
            Échéance <span aria-hidden="true">*</span>
          </label>
          <div className="relative">
            <input
              id="task-due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="h-13.25 w-full border border-system-neutral rounded-sm px-4 py-3 pr-11 text-sm text-text-primary bg-bg-content transition "
              aria-required="true"
              required
            />           
          </div>
        </div>

        {/* Assigné à */}
        <div className="flex flex-col gap-1">
          <span className="text-sm text-text-primary">Assigné à</span>

          {selectedAssignees.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-1">
              {selectedAssignees.map((u) => (
                <div key={u.id} className="flex items-center gap-1.5 bg-bg-grey-light rounded-full px-2 py-1">
                  <div className="w-5 h-5 rounded-full bg-brand-light flex items-center justify-center shrink-0">
                    <span className="text-[9px] font-semibold text-text-primary">
                      {getInitials(u.name)}
                    </span>
                  </div>
                  <span className="text-xs text-text-primary">{u.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAssignee(u.id)}
                    className="text-text-secondary hover:text-system-error text-xs ml-0.5"
                    aria-label={`Retirer ${u.name}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="relative">
            <button
              type="button"
              onClick={() => setAssigneeOpen((v) => !v)}
              className="w-full flex items-center justify-between border border-system-neutral rounded-[8px] px-4 py-3 text-sm bg-bg-content transition"
            >
              <span className="text-text-secondary">Choisir un nouveau collaborateur</span>
              <svg
                className={`h-4 w-4 text-[#6B7280] transition-transform ${assigneeOpen ? "rotate-180" : ""}`}
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 8l5 5 5-5" />
              </svg>
            </button>

            {assigneeOpen && availableUsers.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-20 bg-bg-content border border-system-neutral rounded-[8px] shadow-modal mt-1 overflow-hidden">
                {availableUsers.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => addAssignee(u)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-bg-grey-light transition"
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    u.id === ownerId ? "bg-brand-light" : "bg-bg-grey-border"
                  }`}>
                    <span className="text-[9px] font-semibold text-text-secondary">
                      {getInitials(u.name)}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-sm text-text-secondary ${
                    u.id === ownerId ? "bg-brand-light" : "bg-bg-grey-border"
                  }`}>
                    {u.name}
                  </span>
                </button>
              ))}
              </div>
            )}
          </div>
        </div>

        {/* Statut */}
        <div className="flex flex-col gap-1">
          <span className="text-sm text-text-primary">Statut</span>
          <div className="flex gap-2 flex-wrap" role="group" aria-label="Statut de la tâche">
            {statusOptions.map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setStatus(value)}
                aria-pressed="false"
                className={`px-3 py-1.5 rounded-full text-xs transition mt-1 ${
                  status === value
                    ? "bg-system-info text-text-info"
                    : statusColor[value] 
                }`}
              >
                {label}
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

        {/* Bouton aligné à gauche */}
        <div className="mt-4">
          <button
            type="submit"
            disabled={loading || !title.trim() || !description.trim() || !dueDate || !status}
            className="w-45.25 h-12.5 bg-system-neutral text-text-primary text-sm rounded-[8px] hover:border border-brand-dark hover:bg-bg-content hover:text-brand-dark transition disabled:opacity-50"
          >
            {loading ? "En cours..." : submitLabel}
          </button>
        </div>

      </div>

    </form>
  );
}