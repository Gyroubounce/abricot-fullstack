"use client";

import { useEffect } from "react";
import { useProjects } from "@/hooks/useProjects";
import { useModal } from "@/hooks/useModal";
import ProjectCard from "@/components/projects/ProjectCard";
import CreateProjectModal from "@/components/modals/CreateProjectModal";
import type { User } from "@/types/index";

export default function ProjectsPage() {
  const { projects, loading, error, fetchProjects, createProject, addContributor } = useProjects();
  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  async function handleCreateProject(
    name: string,
    description: string,
    contributors: User[]
  ) {
    const projectId = await createProject(name, description);
    if (!projectId) return;
    await Promise.all(
      contributors.map((user) => addContributor(projectId, user.email))
    );
    await fetchProjects();
  }

  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-[28px] font-manrope font-semibold text-text-primary">
            Mes Projets
          </h1>
          <p className="text-sm text-text-secondary">
            Gérez vos projets
          </p>
        </div>

        <button
          onClick={() => openModal("createProject")}
          className="px-4 py-2 bg-btn-black text-text-white text-sm font-medium rounded-md hover:opacity-90 transition"
          aria-label="Créer un nouveau projet"
        >
          + Créer un projet
        </button>
      </div>

      {/* États */}
      {loading && (
        <p role="status" aria-live="polite" className="text-sm text-text-secondary">
          Chargement des projets...
        </p>
      )}

      {!loading && error && (
        <p role="alert" aria-live="assertive" className="text-sm text-system-error">
          {error}
        </p>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-text-secondary text-sm">
            Aucun projet pour le moment.
          </p>
          <button
            onClick={() => openModal("createProject")}
            className="px-4 py-2 bg-btn-black text-text-white text-sm font-medium rounded-md hover:opacity-90 transition"
          >
            + Créer votre premier projet
          </button>
        </div>
      )}

      {/* Grille projets */}
      {!loading && !error && projects.length > 0 && (
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          aria-label="Liste des projets"
        >
          {projects.map((project) => (
            <li key={project.id}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      )}

      {/* Modale */}
      {isOpen("createProject") && (
        <CreateProjectModal
          onClose={closeModal}
          onSubmit={handleCreateProject}
        />
      )}

    </div>
  );
}