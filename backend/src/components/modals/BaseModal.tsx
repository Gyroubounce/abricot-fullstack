"use client";

import { useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { ReactNode } from "react";

type Props = {
  id: string;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  icon?: ReactNode;
};

export default function BaseModal({
  id,
  title,
  onClose,
  children,
  maxWidth = "max-w-149.5",
  icon
}: Props) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby={id}
      onClick={onClose}
    >
      <div
        className={`bg-bg-content rounded-[8px] shadow-modal w-full ${maxWidth} max-h-[90vh] overflow-y-auto p-6 flex flex-col gap-5`}
        onClick={(e) => e.stopPropagation()}
      >
       {/* Header */}
      <div className="flex flex-col">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition"
            aria-label="Fermer la modale"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-center ml-12 gap-2">
          {icon && <div className="mt-2.5">{icon}</div>}
          <h2
            id={id}
            className="font-semibold text-text-primary text-2xl mt-2"
          >
            {title}
          </h2> 
        </div>       
      </div>

        {/* Contenu */}
        {children}

      </div>
    </div>
  );
}