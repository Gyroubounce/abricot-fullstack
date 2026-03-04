"use client";

import { useState, useRef, useEffect } from "react";
import { XMarkIcon, SparklesIcon, PlusIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import type { Task } from "@/types/index";

type AITask = {
  id: string;
  title: string;
  description: string;
  priority: Task["priority"];
};

type Props = {
  onClose: () => void;
  onSubmit: (tasks: AITask[]) => Promise<void>;
};

export default function AITaskModal({ onClose, onSubmit }: Props) {
  const [prompt, setPrompt] = useState("");
  const [generatedTasks, setGeneratedTasks] = useState<AITask[]>([]);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const promptRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    promptRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setGenerating(true);
    setError(null);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `Tu es un assistant de gestion de projet. 
Génère une liste de tâches à partir de cette description : "${prompt}".
Réponds UNIQUEMENT en JSON valide, sans markdown ni backticks, avec ce format exact :
[
  {
    "title": "Titre de la tâche",
    "description": "Description courte",
    "priority": "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  }
]
Maximum 6 tâches. Sois précis et actionnable.`,
            },
          ],
        }),
      });

      const data = await response.json();
      const text = data.content
        .map((item: { type: string; text?: string }) => item.type === "text" ? item.text : "")
        .filter(Boolean)
        .join("");

      const parsed: Omit<AITask, "id">[] = JSON.parse(text);
      const withIds: AITask[] = parsed.map((t, i) => ({
        ...t,
        id: `ai-${Date.now()}-${i}`,
      }));

      setGeneratedTasks(withIds);
    } catch {
      setError("Erreur lors de la génération. Vérifiez votre prompt et réessayez.");
    } finally {
      setGenerating(false);
    }
  }

  function removeTask(id: string) {
    setGeneratedTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function updateTask(id: string, field: keyof Omit<AITask, "id">, value: string) {
    setGeneratedTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  }

  async function handleSubmit() {
    if (generatedTasks.length === 0) return;
    setLoading(true);
    setError(null);

    try {
      await onSubmit(generatedTasks);
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
      aria-labelledby="ai-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-bg-content rounded-[8px] shadow-modal w-full max-w-[598px] max-h-[90vh] overflow-y-auto p-6 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-5 w-5 text-brand-dark" aria-hidden="true" />
            <h2
              id="ai-modal-title"
              className="font-manrope font-semibold text-text-primary text-lg"
            >
              Créer une tâche
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition"
            aria-label="Fermer la modale"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Tâches générées */}
        {generatedTasks.length > 0 && (
          <div
            className="flex flex-col gap-3 bg-bg-grey-light rounded-[8px] p-4"
            aria-label="Tâches générées"
          >
            {generatedTasks.map((task) => (
              <div
                key={task.id}
                className="bg-bg-content rounded-[8px] shadow-card px-4 py-3 flex flex-col gap-2"
              >
                {editingId === task.id ? (
                  // Mode édition
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={task.title}
                      onChange={(e) => updateTask(task.id, "title", e.target.value)}
                      className="border border-system-neutral rounded-[8px] px-3 py-1.5 text-sm text-text-primary bg-bg-content"
                      aria-label="Titre de la tâche"
                    />
                    <textarea
                      value={task.description}
                      onChange={(e) => updateTask(task.id, "description", e.target.value)}
                      className="border border-system-neutral rounded-[8px] px-3 py-1.5 text-sm text-text-primary bg-bg-content resize-none"
                      rows={2}
                      aria-label="Description de la tâche"
                    />
                    <select
                      value={task.priority}
                      onChange={(e) => updateTask(task.id, "priority", e.target.value)}
                      className="border border-system-neutral rounded-[8px] px-3 py-1.5 text-sm text-text-primary bg-bg-content"
                      aria-label="Priorité de la tâche"
                    >
                      <option value="LOW">Basse</option>
                      <option value="MEDIUM">Moyenne</option>
                      <option value="HIGH">Haute</option>
                      <option value="URGENT">Urgente</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="self-end text-xs text-brand-dark hover:underline"
                    >
                      Valider
                    </button>
                  </div>
                ) : (
                  // Mode lecture
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary font-manrope">
                        {task.title}
                      </p>
                      <p className="text-xs text-text-secondary line-clamp-2">
                        {task.description}
                      </p>
                      <span className="text-xs text-brand-dark">{task.priority}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => setEditingId(task.id)}
                        className="p-1 text-text-secondary hover:text-text-primary transition"
                        aria-label={`Modifier la tâche ${task.title}`}
                      >
                        <PencilIcon className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeTask(task.id)}
                        className="p-1 text-text-secondary hover:text-system-error transition"
                        aria-label={`Supprimer la tâche ${task.title}`}
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Input prompt */}
        <div className="flex flex-col gap-2">
          <label htmlFor="ai-prompt" className="text-sm font-medium text-text-primary">
            Décrivez les tâches que vous souhaitez ajouter
          </label>
          <div className="flex gap-2 items-end">
            <textarea
              id="ai-prompt"
              ref={promptRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 border border-system-neutral rounded-[8px] px-4 py-2.5 text-sm text-text-primary bg-bg-content transition resize-none"
              placeholder="Ex : Créer les tâches pour le développement d'une API REST avec authentification..."
              rows={3}
            />
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generating || !prompt.trim()}
              className="shrink-0 w-10 h-10 rounded-full bg-brand-dark text-text-white flex items-center justify-center hover:opacity-90 transition disabled:opacity-50"
              aria-label="Générer les tâches"
            >
              {generating ? (
                <span className="text-xs">...</span>
              ) : (
                <PlusIcon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Erreur */}
        {error && (
          <p role="alert" aria-live="assertive" className="text-sm text-system-error">
            {error}
          </p>
        )}

        {/* Bouton ajouter */}
        {generatedTasks.length > 0 && (
          <>
            <hr aria-hidden="true" className="border-system-neutral" />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-2.5 bg-btn-black text-text-white text-sm font-medium rounded-[8px] hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Ajout en cours..." : "Ajouter les tâches"}
            </button>
          </>
        )}

      </div>
    </div>
  );
}