"use client";

import { useState } from "react";
import BaseModal from "@/components/modals/BaseModal";
import ProjectForm from "@/components/forms/ProjectForm";
import type { ProjectMember } from "@/types/index";

type Props = {
  initialName: string;
  initialDescription: string;
  initialMembers: ProjectMember[];
  onClose: () => void;
  onSubmit: (name: string, description: string) => Promise<void>;
  onAddContributor: (email: string) => Promise<void>;
  onRemoveContributor: (userId: string) => Promise<void>;
};

export default function EditProjectModal({
  initialName,
  initialDescription,
  initialMembers,
  onClose,
  onSubmit,
  onAddContributor,
  onRemoveContributor,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(name: string, description: string) {
    setError(null);
    setLoading(true);
    try {
      await onSubmit(name, description);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddContributor(user: { email: string }) {
    try {
      await onAddContributor(user.email);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    }
  }

  async function handleRemoveContributor(userId: string) {
    try {
      await onRemoveContributor(userId);
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
        submitLabel="Enregistrer"
        loading={loading}
        error={error}
        onSubmit={handleSubmit}
        onAddContributor={handleAddContributor}
        onRemoveContributor={handleRemoveContributor}
      />
    </BaseModal>
  );
}