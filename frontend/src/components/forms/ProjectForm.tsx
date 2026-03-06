"use client";

import { useState } from "react";
import ContributorSearch from "@/components/ui/ContributorSearch";
import { getInitials } from "@/lib/utils/initials";
import type { User, ProjectMember } from "@/types/index";

type Props = {
  initialName?: string;
  initialDescription?: string;
  initialMembers?: ProjectMember[];
  submitLabel: string;
  loading: boolean;
  error: string | null;
  onSubmit: (name: string, description: string) => Promise<void>;
  onAddContributor?: (user: User) => void;
  onRemoveContributor?: (userId: string) => void;
  selectedContributors?: User[];
};

export default function ProjectForm({
  initialName = "",
  initialDescription = "",
  initialMembers = [],
  submitLabel,
  loading,
  error,
  onSubmit,
  onAddContributor,
  onRemoveContributor,
  selectedContributors = [],
}: Props) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit(name, description);
  }

  const excludeUserIds = initialMembers.map((m) => m.user.id);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

      {/* Titre */}
      <div className="flex flex-col gap-1">
        <label htmlFor="project-name" className="text-sm font-medium text-text-primary">
          Titre <span aria-hidden="true">*</span>
        </label>
        <input
          id="project-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-system-neutral rounded-[8px] px-4 py-2.5 text-sm text-text-primary bg-bg-content transition"
          placeholder="Nom du projet"
          aria-required="true"
          required
          autoFocus
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label htmlFor="project-description" className="text-sm font-medium text-text-primary">
          Description
        </label>
        <textarea
          id="project-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-system-neutral rounded-[8px] px-4 py-2.5 text-sm text-text-primary bg-bg-content transition resize-none"
          placeholder="Description du projet"
          rows={3}
        />
      </div>

      {/* Contributeurs existants (mode édition) */}
      {initialMembers.length > 0 && onRemoveContributor && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-text-primary">
            Contributeurs actuels
          </span>
          <div className="flex flex-wrap gap-2">
            {initialMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-1.5 bg-bg-grey-light px-2.5 py-1 rounded-full"
              >
                <div
                  className="w-5 h-5 rounded-full bg-brand-light flex items-center justify-center"
                  aria-hidden="true"
                >
                  <span className="text-[10px] font-semibold text-text-primary">
                    {getInitials(member.user.name)}
                  </span>
                </div>
                <span className="text-xs text-text-primary">{member.user.name}</span>
                <button
                  type="button"
                  onClick={() => onRemoveContributor(member.user.id)}
                  className="text-text-secondary hover:text-system-error transition"
                  aria-label={`Retirer ${member.user.name}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recherche contributeurs */}
      {onAddContributor && onRemoveContributor && (
        <ContributorSearch
          selectedUsers={selectedContributors}
          excludeUserIds={excludeUserIds}
          onAdd={onAddContributor}
          onRemove={onRemoveContributor}
          label="Ajouter un contributeur"
        />
      )}

      {/* Erreur */}
      {error && (
        <p role="alert" aria-live="assertive" className="text-sm text-system-error">
          {error}
        </p>
      )}

      {/* Bouton */}
      <button
        type="submit"
        disabled={loading || !name.trim()}
        className="mt-2 w-full py-2.5 bg-btn-black text-text-white text-sm font-medium rounded-[8px] hover:opacity-90 transition disabled:opacity-50"
      >
        {loading ? "En cours..." : submitLabel}
      </button>

    </form>
  );
}