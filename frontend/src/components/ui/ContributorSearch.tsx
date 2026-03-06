"use client";

import { useState, useRef, useEffect } from "react";
import { MagnifyingGlassIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { getInitials } from "@/lib/utils/initials";
import { searchUsers } from "@/lib/api/users";
import type { User } from "@/types/index";

type Props = {
  selectedUsers: User[];
  excludeUserIds?: string[];
  onAdd: (user: User) => void;
  onRemove: (userId: string) => void;
  label?: string;
  placeholder?: string;
  localUsers?: User[];
};

export default function ContributorSearch({
  selectedUsers,
  excludeUserIds = [],
  onAdd,
  onRemove,
  label = "Contributeurs",
  placeholder = "Rechercher par nom ou email",
  localUsers,
}: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listboxId = useRef(`contributor-listbox-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    if (!query || query.length < 1) {
      setResults([]);
      return;
    }

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (localUsers) {
      const filtered = localUsers.filter(
        (u) =>
          !selectedUsers.some((s) => s.id === u.id) &&
          !excludeUserIds.includes(u.id) &&
          (u.name.toLowerCase().includes(query.toLowerCase()) ||
            u.email.toLowerCase().includes(query.toLowerCase()))
      );
      setResults(filtered);
      return;
    }

    if (query.length < 2) return;

    searchTimeout.current = setTimeout(async () => {
      setSearching(true);
      try {
        const { data } = await searchUsers(query);
        if (data) {
          const filtered = data.users.filter(
            (u: User) =>
              !selectedUsers.some((s) => s.id === u.id) &&
              !excludeUserIds.includes(u.id)
          );
          setResults(filtered);
        }
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  }, [query, selectedUsers, excludeUserIds, localUsers]);

  function handleAdd(user: User) {
    onAdd(user);
    setQuery("");
    setResults([]);
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-text-primary">{label}</span>

      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2" aria-label="Contributeurs sélectionnés">
          {selectedUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-1.5 bg-bg-grey-light px-2.5 py-1 rounded-full"
            >
              <div
                className="w-5 h-5 rounded-full bg-brand-light flex items-center justify-center"
                aria-hidden="true"
              >
                <span className="text-[10px] font-semibold text-text-primary">
                  {getInitials(user.name)}
                </span>
              </div>
              <span className="text-xs text-text-primary">{user.name}</span>
              <button
                type="button"
                onClick={() => onRemove(user.id)}
                className="text-text-secondary hover:text-system-error transition"
                aria-label={`Retirer ${user.name}`}
              >
                <XCircleIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="relative">
        <MagnifyingGlassIcon
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary"
          aria-hidden="true"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-system-neutral rounded-[8px] pl-9 pr-4 py-2.5 text-sm text-text-primary bg-bg-content transition"
          placeholder={placeholder}
          autoComplete="off"
          aria-label={`Rechercher un ${label.toLowerCase()}`}
          aria-controls={listboxId.current}
          aria-expanded={results.length > 0 || searching}
          role="combobox"
          aria-autocomplete="list"
          aria-haspopup="listbox"
        />

        {(results.length > 0 || searching) && (
          <div
            id={listboxId.current}
            role="listbox"
            aria-label="Résultats de recherche"
            className="absolute z-10 w-full mt-1 bg-bg-content border border-system-neutral rounded-[8px] shadow-modal overflow-hidden"
          >
            {searching && (
              <div className="px-4 py-2.5 text-sm text-text-secondary">
                Recherche...
              </div>
            )}
            {!searching && results.map((user) => (
              <div
                key={user.id}
                role="option"
                aria-selected="false"
                tabIndex={0}
                onClick={() => handleAdd(user)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd(user)}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-bg-grey-light transition cursor-pointer"
              >
                <div
                  className="w-7 h-7 rounded-full bg-bg-grey-light flex items-center justify-center shrink-0"
                  aria-hidden="true"
                >
                  <span className="text-xs font-semibold text-text-primary">
                    {getInitials(user.name)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-text-primary">{user.name}</span>
                  <span className="text-xs text-text-secondary">{user.email}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}