"use client";

import { useState } from "react";
import ContributorSearch from "@/components/ui/ContributorSearch";
import { getInitials } from "@/lib/utils/initials";
import type { User, ProjectMember } from "@/types/index";

type Props = {
  initialName?: string;
  initialDescription?: string;
  initialMembers?: ProjectMember[];

  projectContributors: User[];
  totalContributors: number;

  submitLabel: string;
  loading: boolean;
  error: string | null;

  // 🔥 Correction : onSubmit transmet aussi les contributeurs
  onSubmit: (name: string, description: string, contributors: string[]) => Promise<void>;

  projectId?: string;
  onDelete: () => void;

  onAddContributor?: (user: User) => void;
  onRemoveContributor?: (userId: string) => void;
  selectedContributors?: User[];
  ownerId?: string;
};

export default function ProjectForm({
  initialName = "",
  initialDescription = "",
  initialMembers = [],

  totalContributors,
  submitLabel,
  loading,
  error,
  onSubmit,
  onDelete,
  projectId,
  onAddContributor,
  onRemoveContributor,
  selectedContributors = [],
  ownerId,
}: Props) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);

  // 🔥 Correction : transmettre les contributeurs sélectionnés
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const contributorEmails = selectedContributors.map((c) => c.email);
    await onSubmit(name, description, contributorEmails);

  }

  const excludeUserIds = initialMembers.map((m) => m.user.id);

  const ownerMember = initialMembers.find((m) => m.user.id === ownerId);
  const ownerName = ownerMember?.user.name ?? "";
  const ownerInitials = getInitials(ownerName);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="w-113 h-auto mx-auto overflow-y-auto flex flex-col gap-4 pr-1">

        {/* Titre */}
        <div className="flex flex-col gap-1">
          <label htmlFor="project-name" className="text-sm text-police-black">
            Titre <span aria-hidden="true">*</span>
          </label>
          <input
            id="project-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-13.25 px-4 py-2.5 text-sm text-police-black bg-bg-content transition"
            placeholder="Nom du projet"
            required
            autoFocus
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label htmlFor="project-description" className="text-sm text-text-primary">
            Description
          </label>
          <textarea
            id="project-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="px-4 py-2.5 h-13.25 text-sm text-police-black bg-bg-content transition resize-none"
            placeholder="Description du projet"
          />
        </div>

        {/* Contributeurs actuels */}
        {onRemoveContributor && (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-text-primary">
              Contributeurs actuels ({totalContributors})
            </span>

            <div className="flex flex-wrap items-center gap-2">

              {/* Propriétaire */}
              {ownerMember && (
                <div className="flex items-center gap-1 px-2.5 rounded-full">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      ownerMember.user.id === ownerId
                        ? "bg-brand-light"
                        : "bg-bg-grey-border"
                    }`}
                  >
                    <span
                      className={`text-[10px]  ${
                        ownerMember.user.id === ownerId
                          ? "text-text-primary"
                          : "text-text-secondary"
                      }`}
                    >
                      {ownerInitials}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      ownerMember.user.id === ownerId
                        ? "bg-brand-light text-text-primary"
                        : "bg-bg-grey-border text-text-secondary"
                    }`}
                  >
                    {ownerName}
                  </span>
                </div>
              )}

              {/* Contributeurs du projet */}
              {selectedContributors.map((user) => (
                <div key={user.id} className="flex items-center gap-1 px-2.5 rounded-full">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      user.id === ownerId ? "bg-brand-light" : "bg-bg-grey-border"
                    }`}
                  >
                    <span
                      className={`text-[10px] ${
                        user.id === ownerId
                          ? "text-text-primary"
                          : "text-text-secondary"
                      }`}
                    >
                      {getInitials(user.name)}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      user.id === ownerId
                        ? "bg-brand-light text-text-primary"
                        : "bg-bg-grey-border text-text-secondary"
                    }`}
                  >
                    {user.name}
                  </span>

                  <button
                    type="button"
                    onClick={() => onRemoveContributor(user.id)}
                    className="text-text-secondary mb-1 hover:text-brand-dark transition"
                    aria-label={`Retirer ${user.name}`}
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
            ownerId={ownerId}
           buttonLabel={
            selectedContributors.length > 0
              ? `${selectedContributors.length} collaborateur${selectedContributors.length > 1 ? "s" : ""}`
              : "Choisir un ou plusieurs collaborateurs"
          }

          />
        )}

        {/* Erreur */}
        {error && (
          <p role="alert" aria-live="assertive" className="text-sm text-text-error">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-row justify-between mt-4">

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-46.25 h-12.5 py-2.5 bg-system-neutral text-text-neutral text-base rounded-[10px] hover:border border-brand-dark hover:text-brand-dark hover:bg-bg-content transition"
          >
            {loading ? "En cours..." : submitLabel}
          </button>

          {onDelete && projectId && (
            <button
              type="button"
              className="text-text-error hover:text-red-700 text-sm"
              onClick={onDelete}
            >
              Supprimer le projet
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
