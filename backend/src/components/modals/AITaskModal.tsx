"use client";

import { useState } from "react";
import BaseModal from "@/components/modals/BaseModal";
import AIForm from "@/components/forms/AIForm";
import AITaskListModal from "@/components/modals/AITaskListModal";
import IAIcon from "@/components/ui/icons/IAIcon";
import type { Task } from "@/types/index";

type AITask = {
  id: string;
  title: string;
  description: string;
  priority: Task["priority"];
};

type Props = {
  onClose: () => void;
  onSubmit: (tasks: AITask[]) => Promise<void>;
};

export default function AITaskModal({ onClose, onSubmit }: Props) {
  const [generatedTasks, setGeneratedTasks] = useState<AITask[]>([]);
  const [showTaskList, setShowTaskList] = useState(false);

  function handleTasksGenerated(tasks: AITask[]) {
    setGeneratedTasks(tasks);
    setShowTaskList(true);
  }

  function handleCloseTaskList() {
    setShowTaskList(false);
  }

  async function handleSubmitTasks(tasks: AITask[]) {
    await onSubmit(tasks);
    setShowTaskList(false);
    onClose();
  }

  return (
    <>
      <BaseModal 
        id="ai-modal-title" 
        title="Créer une tâche" 
        onClose={onClose}
        icon={<IAIcon className="text-brand-dark" />}
      >
        <div className="w-113 h-133.75 mx-auto flex flex-col">
          {/* Container VIDE de 460px de hauteur */}
          <div className="h-115">
            {/* Container vide - servira pour afficher les tâches générées plus tard */}
          </div>

          {/* Formulaire AIForm EN DESSOUS du container */}
          <div className="mb-15">
            <AIForm onTasksGenerated={handleTasksGenerated} />
          </div>
        </div>
      </BaseModal>

      {/* Modale 2 - Liste des tâches */}
      {showTaskList && (
        <AITaskListModal
          tasks={generatedTasks}
          onClose={handleCloseTaskList}
          onSubmit={handleSubmitTasks}
          onTasksUpdate={setGeneratedTasks}
        />
      )}
    </>
  );
}