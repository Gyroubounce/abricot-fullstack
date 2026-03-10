"use client";

import { useState, useRef } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import type { Task } from "@/types/index";

type AITask = {
  id: string;
  title: string;
  description: string;
  priority: Task["priority"];
};

type Props = {
  onTasksGenerated: (tasks: AITask[]) => void;
};

export default function AIForm({ onTasksGenerated }: Props) {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const promptRef = useRef<HTMLTextAreaElement>(null);

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la génération");
      }

      const data = await response.json();
      
      if (!data.success || !data.tasks) {
        throw new Error("Format de réponse invalide");
      }

      const withIds: AITask[] = data.tasks.map((t: Omit<AITask, "id">, i: number) => ({
        ...t,
        id: `ai-${Date.now()}-${i}`,
      }));

      onTasksGenerated(withIds);
      setPrompt("");
    } catch {
      setError("Erreur lors de la génération. Vérifiez votre prompt et réessayez.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <textarea
          id="ai-prompt"
          ref={promptRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 h-15 border border-system-neutral px-4 py-5 text-[10px] text-police-black bg-bg-dashboard transition resize-none"
          placeholder="Décrivez les tâches que vous souhaitez ajouter"
          rows={3}
        />
        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating || !prompt.trim()}
          className="shrink-0 w-10 h-10 rounded-full bg-brand-dark text-text-white flex items-center justify-center hover:bg-brand-light hover:text-brand-dark transition"
          aria-label="Générer les tâches"
        >
          {generating ? (
            <span className="text-xs">...</span>
          ) : (
            <PlusIcon className="h-4 w-4" />
          )}
        </button>
      </div>

      {error && (
        <p role="alert" aria-live="assertive" className="text-sm text-system-error">
          {error}
        </p>
      )}
    </div>
  );
}