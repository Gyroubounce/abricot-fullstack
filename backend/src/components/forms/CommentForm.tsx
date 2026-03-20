"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getInitials } from "@/lib/utils/initials";
import { createComment } from "@/lib/api/tasks";

type Props = {
  projectId: string;
  taskId: string;
  onRefresh: () => void;
};

export default function CommentForm({ projectId, taskId, onRefresh }: Props) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || !user) return;
    setSubmitting(true);
    await createComment(projectId, taskId, content.trim());
    setContent("");
    setSubmitting(false);
    onRefresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-2">
      {/* Ligne avatar + input */}
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded-full bg-brand-light flex items-center justify-center shrink-0"
          aria-hidden="true"
        >
          <span className="text-[10px] font-semibold text-text-primary">
            {getInitials(user?.name ?? "")}
          </span>
        </div>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Ajouter un commentaire..."
          className="flex-1 h-20.75 text-[10px] text-police-black border border-system-neutral rounded-[8px] px-3 py-2 bg-bg-dashboard transition placeholder:text-[10px] placeholder:text-text-secondary"
          aria-label="Nouveau commentaire"
        />
      </div>

      {/* Bouton aligné à droite */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting || !content.trim()}
          className="w-52.25 h-12.5 text-xs bg-btn-black text-white rounded-[8px] hover:opacity-90 transition disabled:opacity-50"
        >
          {submitting ? "..." : "Envoyer"}
        </button>
      </div>
    </form>
  );
}