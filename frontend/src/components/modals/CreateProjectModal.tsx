"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth"; // ✅ Importer useAuth
import BaseModal from "@/components/modals/BaseModal";
import ProjectForm from "@/components/forms/ProjectForm";
import type { User } from "@/types/index";

type Props = {
  onClose: () => void;
  onSubmit: (name: string, description: string) => Promise<void>;
};

export default function CreateProjectModal({ onClose, onSubmit }: Props) {
  const { user } = useAuth(); // ✅ Récupérer l'utilisateur connecté
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedContributors, setSelectedContributors] = useState<User[]>([]);

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

  function handleAddContributor(contributor: User) {
    setSelectedContributors((prev) => [...prev, contributor]);
  }

  function handleRemoveContributor(userId: string) {
    setSelectedContributors((prev) => prev.filter((u) => u.id !== userId));
  }

  console.log("Owner ID:", user?.id); // ✅ Déboguer

  return (
    <BaseModal id="create-project-title" title="Créer un projet" onClose={onClose}>
      <ProjectForm
        submitLabel="+ Créer le projet"
        loading={loading}
        error={error}
        onSubmit={handleSubmit}
        onAddContributor={handleAddContributor}
        onRemoveContributor={handleRemoveContributor}
        selectedContributors={selectedContributors}
        ownerId={user?.id} // ✅ Passer l'ID de l'utilisateur connecté
      />
    </BaseModal>
  );
}