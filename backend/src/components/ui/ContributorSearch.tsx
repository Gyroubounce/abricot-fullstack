"use client";

import { useState, useEffect } from "react";
import { getInitials } from "@/lib/utils/initials";
import { getUsers } from "@/lib/api/users";
import type { User } from "@/types/index";

type Props = {
  selectedUsers: User[];
  excludeUserIds?: string[];
  onAdd: (user: User) => void;
  onRemove: (userId: string) => void;
  label?: string;
  ownerId?: string; 
  buttonLabel?: string;
};

export default function ContributorSearch({
  selectedUsers,
  excludeUserIds = [],
  onAdd,
  onRemove,
  label = "Contributeurs",
  ownerId, 
  buttonLabel = "Choisir un ou plusieurs collaborateurs",
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    getUsers().then((users) => setAllUsers(users));
  }, []);

  const availableUsers = allUsers.filter(
    (u) =>
      !selectedUsers.find((s) => s.id === u.id) &&
      !excludeUserIds.includes(u.id)
  );

  function handleAdd(user: User) {
    onAdd(user);
    setIsOpen(false);
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-text-primary">{label}</span>

      {/* Contributeurs sélectionnés */}
      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-1">
          {selectedUsers.map((u) => (
            <div
              key={u.id}
              className="flex items-center gap-1.5  rounded-full px-2 py-1"
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                u.id === ownerId ? "bg-brand-light" : "bg-bg-grey-border"
              }`}>
                <span className={`text-[9px] ${
                  u.id === ownerId ? "text-text-primary" : "text-text-secondary"
                }`}>
                  {getInitials(u.name)}
                </span>
              </div>

               <div
                className={` px-2 py-0.5 rounded-full flex items-center justify-center ${
                  u.id === ownerId ? "bg-brand-light" : "bg-bg-grey-border"
                }`}
                >
                <span
                  className={`text-[10px]  ${
                    u.id === ownerId
                      ? "text-text-primary"
                      : "text-text-secondary"
                  }`}
                >
                  {u.name}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onRemove(u.id)}
                className="text-text-secondary hover:text-system-error text-xs ml-0.5"
                aria-label={`Retirer ${u.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dropdown de sélection */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="w-full h-13.25 flex items-center justify-between border border-system-neutral rounded-[8px] px-4 py-3 text-sm bg-bg-content transition"
        >
        <span className="text-text-secondary">{buttonLabel}</span> 
          <svg
            className={`h-6 w-6 text-btn-black transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 8l5 5 5-5" />
          </svg>
        </button>
   

        {/* Liste des utilisateurs disponibles */}
        {isOpen && availableUsers.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-20 bg-bg-content border border-system-neutral rounded-[8px] shadow-modal mt-1 overflow-hidden max-h-48 overflow-y-auto">
            {availableUsers.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleAdd(u)}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-bg-grey-light transition"
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  u.id === ownerId ? "bg-brand-light" : "bg-bg-grey-border"
                }`}>
                  <span className={`text-[9px] font-semibold ${
                    u.id === ownerId ? "text-text-primary" : "text-text-secondary"
                  }`}>
                    {getInitials(u.name)}
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-sm ${
                  u.id === ownerId 
                    ? "bg-brand-light text-text-primary" 
                    : "bg-bg-grey-border text-text-secondary"
                }`}>
                  {u.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}