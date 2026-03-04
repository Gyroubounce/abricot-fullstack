"use client";

import { useState, useRef, useEffect } from "react";
import { XMarkIcon, MagnifyingGlassIcon, XCircleIcon } from "@heroicons/react/24/outline";
import type { User } from "@/types/index";

type Props = {
  onClose: () => void;
  onSubmit: (name: string, description: string, contributors: User[]) => Promise<void>;
};

export default function CreateProjectModal({ onClose, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [selectedContributors, setSelectedContributors] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Focus sur le premier input à l'ouverture
  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  // Fermeture sur Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Recherche utilisateurs avec debounce
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/search?query=${encodeURIComponent(query)}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (res.ok) {
          // Exclure les contributeurs déjà sélectionnés
          const filtered = data.data.users.filter(
            (u: User) => !selectedContributors.some((s) => s.id === u.id)
          );
          setResults(filtered);
        }
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  }, [query, selectedContributors]);

  function addContributor(user: User) {
    setSelectedContributors((prev) => [...prev, user]);
    setQuery("");
    setResults([]);
  }

  function removeContributor(userId: string) {
    setSelectedContributors((prev) => prev.filter((u) => u.id !== userId));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onSubmit(name, description, selectedContributors);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur est survenue");
      }
    } finally {
      setLoading(false);
    }
  }

  function getInitials(name: string): string {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div
        className="bg-bg-content rounded-[8px] shadow-modal w-full max-w-[598px] p-6 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2
            id="modal-title"
            className="font-manrope font-semibold text-text-primary text-lg"
          >
            Créer un projet
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition"
            aria-label="Fermer la modale"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

          {/* Titre */}
          <div className="flex flex-col gap-1">
            <label htmlFor="project-name" className="text-sm font-medium text-text-primary">
              Titre <span aria-hidden="true">*</span>
            </label>
            <input
              id="project-name"
              ref={firstInputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-system-neutral rounded-[8px] px-4 py-2.5 text-sm text-text-primary bg-bg-content transition"
              placeholder="Nom du projet"
              aria-required="true"
              required
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

          {/* Contributeurs */}
          <div className="flex flex-col gap-2">
            <label htmlFor="contributor-search" className="text-sm font-medium text-text-primary">
              Contributeurs
            </label>

            {/* Contributeurs sélectionnés */}
            {selectedContributors.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedContributors.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-1.5 bg-bg-grey-light px-2.5 py-1 rounded-full"
                  >
                    <div className="w-5 h-5 rounded-full bg-brand-light flex items-center justify-center">
                      <span className="text-[10px] font-semibold text-text-primary">
                        {getInitials(user.name)}
                      </span>
                    </div>
                    <span className="text-xs text-text-primary">{user.name}</span>
                    <button
                      type="button"
                      onClick={() => removeContributor(user.id)}
                      className="text-text-secondary hover:text-system-error transition"
                      aria-label={`Retirer ${user.name}`}
                    >
                      <XCircleIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Recherche */}
            <div className="relative">
              <div className="relative">
                <MagnifyingGlassIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary"
                  aria-hidden="true"
                />
                <input
                  id="contributor-search"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full border border-system-neutral rounded-[8px] pl-9 pr-4 py-2.5 text-sm text-text-primary bg-bg-content transition"
                  placeholder="Rechercher par nom ou email"
                  aria-label="Rechercher un contributeur"
                  autoComplete="off"
                />
              </div>

              {/* Résultats */}
              {(results.length > 0 || searching) && (
                <ul
                  className="absolute z-10 w-full mt-1 bg-bg-content border border-system-neutral rounded-[8px] shadow-modal overflow-hidden"
                  role="listbox"
                  aria-label="Résultats de recherche"
                >
                  {searching && (
                    <li className="px-4 py-2.5 text-sm text-text-secondary">
                      Recherche...
                    </li>
                  )}
                  {!searching && results.map((user) => (
                    <li key={user.id} role="option" aria-selected="false">
                      <button
                        type="button"
                        onClick={() => addContributor(user)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-bg-grey-light transition text-left"
                      >
                        <div className="w-7 h-7 rounded-full bg-bg-grey-light flex items-center justify-center shrink-0">
                          <span className="text-xs font-semibold text-text-primary">
                            {getInitials(user.name)}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-text-primary">{user.name}</span>
                          <span className="text-xs text-text-secondary">{user.email}</span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

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
            {loading ? "Création en cours..." : "Ajouter un projet"}
          </button>

        </form>
      </div>
    </div>
  );
}