import { useState } from "react";

type ModalName =
  | "createProject"
  | "editProject"
  | "createTask"
  | "editTask"
  | "aiTask"
  | null;

export function useModal() {
  const [activeModal, setActiveModal] = useState<ModalName>(null);

  function openModal(name: NonNullable<ModalName>) {
    setActiveModal(name);
  }

  function closeModal() {
    setActiveModal(null);
  }

  function isOpen(name: NonNullable<ModalName>) {
    return activeModal === name;
  }

  return { activeModal, openModal, closeModal, isOpen };
}