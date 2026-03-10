"use client";

import { useState } from "react";
import BaseModal from "@/components/modals/BaseModal";
import AIForm from "@/components/forms/AIForm";
import IACard from "@/components/projects/IACard";
import type { Task } from "@/types/index";
import IAIcon from "@/components/ui/icons/IAIcon";

type AITask = {
  id: string;
  title: string;
  description: string;
  priority: Task["priority"];
};

type Props = {
  tasks: AITask[];
  onClose: () => void;
  onSubmit: (tasks: AITask[]) => Promise<void>;
  onTasksUpdate: (tasks: AITask[]) => void;
};

export default function AITaskListModal({ tasks, onClose, onSubmit, onTasksUpdate }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  function removeTask(id: string) {
    onTasksUpdate(tasks.filter((t) => t.id !== id));
  }

  function updateTask(id: string, field: keyof Omit<AITask, "id">, value: string) {
    onTasksUpdate(tasks.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  }

  function handleTasksGenerated(newTasks: AITask[]) {
    onTasksUpdate([...tasks, ...newTasks]);
  }

  async function handleSubmit() {
    if (tasks.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      await onSubmit(tasks);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <BaseModal 
        id="task-list-modal-title" 
        title="Vos tâches"
        onClose={onClose}
        icon={<IAIcon className="text-brand-dark" />}
        >
        <div className="w-113 mx-auto">
            {/* Liste des tâches générées */}
            {tasks.length > 0 && (
            <div
                className="flex flex-col h-133.75 overflow-y-auto p-4"
                aria-label="Tâches générées"
            >
                {tasks.map((task) => (
                <IACard
                    key={task.id}
                    task={task}
                    isEditing={editingId === task.id}
                    onEdit={() => setEditingId(task.id)}
                    onDelete={() => removeTask(task.id)}
                    onUpdate={(field, value) => updateTask(task.id, field, value)}
                    onSave={() => setEditingId(null)}
                />
                ))}
            </div>
            )}

            {/* Bouton ajouter les tâches */}
            {tasks.length > 0 && (
            <>
                <hr aria-hidden="true" className="my-4" />
                <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-45.25 h-12.5 mx-auto mb-5 bg-btn-black text-text-white text-base  rounded-[10px] flex items-center justify-center gap-2 hover:border border-brand-dark hover:bg-bg-content hover:text-brand-dark transition "
                >
                <span className="text-lg leading-none">+</span>
                {loading ? "Ajout en cours..." : "Ajouter les tâches"}
                </button>
            </>
            )}

            {/* Formulaire pour ajouter d'autres tâches */}
            <AIForm onTasksGenerated={handleTasksGenerated} />

            {/* Erreur */}
            {error && (
            <p role="alert" aria-live="assertive" className="text-sm text-text-error mt-4">
                {error}
            </p>
            )}
        </div>
    </BaseModal>
  );
}