"use client";

import { useState, useEffect } from "react";
import BaseModal from "@/components/modals/BaseModal";
import ProjectForm from "@/components/forms/ProjectForm";
import ModalProjectDelete from "@/components/modals/ModalProjectDelete";
import type { ProjectMember, User } from "@/types/index";

type Props = {
  projectId: string;
  initialName: string;
  initialDescription: string;
  initialMembers: ProjectMember[];
  ownerId: string;
  projectContributors: User[];   // 🔹 remplacé uniqueContributors
  totalContributors: number;     // 🔹 toujours utile pour l’affichage
  onClose: () => void;
  onSubmit: (projectId: string, name: string, description: string) => Promise<void>;

  onAddContributor: (projectId: string, email: string) => Promise<void>;

  onRemoveContributor: (projectId: string, userId: string) => Promise<void>;

  onRefresh: () => Promise<void>;

  onDelete: (projectId: string) => Promise<void>;
};

export default function EditProjectModal({
  projectId,
  initialName,
  initialDescription,
  initialMembers,
  ownerId,
  projectContributors,
  totalContributors,
  onClose,
  onSubmit,
  onAddContributor,
  onRemoveContributor,
  onRefresh,
  onDelete,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedContributors, setSelectedContributors] = useState<User[]>(projectContributors);

  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
  setSelectedContributors(projectContributors);
}, [projectContributors]);

  async function handleSubmit(name: string, description: string) {
    setError(null);
    setLoading(true);
    try {
      await onSubmit(projectId, name, description);

      await onRefresh(); 

      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  // 🔹 Ajout d’un contributeur via ContributorSearch
  async function handleAddContributor(user: User) {
    try {
      await onAddContributor(projectId, user.email);

      setSelectedContributors((prev) => [...prev, user]);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    }
  }

  // 🔹 Suppression d’un contributeur
  async function handleRemoveContributor(userId: string) {
    try {
      await onRemoveContributor(projectId, userId);

      setSelectedContributors((prev) => prev.filter((u) => u.id !== userId));
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    }
  }

  return (
    <BaseModal id="edit-project-title" title="Modifier un projet" onClose={onClose}>
      <ProjectForm
        initialName={initialName}
        initialDescription={initialDescription}
        initialMembers={initialMembers}
        projectContributors={projectContributors}   // 🔹 cohérent avec ProjectDetailPage
        totalContributors={totalContributors}
        submitLabel="Enregistrer"
        loading={loading}
        error={error}
        onSubmit={handleSubmit}
        onAddContributor={handleAddContributor}
        onRemoveContributor={handleRemoveContributor}
        selectedContributors={selectedContributors}
        ownerId={ownerId}
        projectId={projectId}
        onDelete={() => setDeleteOpen(true)}
      />

      {deleteOpen && (
        <ModalProjectDelete
          onClose={() => setDeleteOpen(false)}
          onConfirm={async () => {
            await onDelete(projectId);
            onClose();
          }}
        />
      )}
    </BaseModal>
  );
}
