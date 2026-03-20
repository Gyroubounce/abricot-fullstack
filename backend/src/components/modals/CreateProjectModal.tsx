"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BaseModal from "@/components/modals/BaseModal";
import ProjectForm from "@/components/forms/ProjectForm";
import type { User } from "@/types/index";
import { useAuth } from "@/hooks/useAuth"; // exemple

type Props = {
  onClose: () => void;
  onSubmit: (name: string, description: string, contributors: User[]) => Promise<void>;
};

export default function CreateProjectModal({ onClose, onSubmit }: Props) {
  const { user } = useAuth();        // 🔥 utilisateur connecté
  const ownerId = user?.id;          // 🔥 owner = user connecté

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedContributors, setSelectedContributors] = useState<User[]>([]);
  const router = useRouter();

  async function handleSubmit(name: string, description: string) {
    setError(null);
    setLoading(true);
    try {
      await onSubmit(name, description, selectedContributors);
      onClose();
      router.push("/dashboard/projects");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <BaseModal id="create-project-title" title="Créer un projet" onClose={onClose}>
      <ProjectForm
        submitLabel="Créer"
        loading={loading}
        error={error}
        onSubmit={handleSubmit}

        initialMembers={[]}               // pas de membres initiaux
        ownerId={ownerId}                 // 🔥 maintenant présent !

        projectContributors={selectedContributors}
        totalContributors={selectedContributors.length}

        selectedContributors={selectedContributors}
        onAddContributor={(user) =>
          setSelectedContributors((prev) => [...prev, user])
        }
        onRemoveContributor={(userId) =>
          setSelectedContributors((prev) => prev.filter((u) => u.id !== userId))
        }

        onDelete={() => {}}               // pas de suppression ici
      />
    </BaseModal>
  );
}
