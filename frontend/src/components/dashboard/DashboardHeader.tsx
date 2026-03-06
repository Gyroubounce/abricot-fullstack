import Image from "next/image";
import Taches from "@/app/assets/Taches.png";
import Kanban from "@/app/assets/Kanban.png";

type Props = {
  name: string;
  onCreateProject: () => void;
  view: "list" | "kanban";
  onViewChange: (view: "list" | "kanban") => void;
};

export default function DashboardHeader({
  name,
  onCreateProject,
  view,
  onViewChange,
}: Props) {
  return (
    <div className="flex flex-col gap-12 my-8">

      {/* Titre + bouton */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-[24px] font-semibold text-text-primary">
            Tableau de bord
          </h1>
          <p className="text-[18px] text-black">
            Bonjour {name}, voici un aperçu de vos projets et tâches.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateProject}
          className="px-4 py-2 w-45.25 h-12.5 rounded-md bg-btn-2-Black text-white text-[16px] hover:text-brand-dark hover:bg-bg-content hover:border border-brand-dark transition"
          aria-label="Créer un nouveau projet"
        >
          + Créer un projet
        </button>
      </div>

      {/* Boutons Liste / Kanban */}
      <div className="flex gap-3" role="group" aria-label="Mode d'affichage">
        <button
          type="button"
          onClick={() => onViewChange("list")}
          aria-pressed="false"
          className={`px-4 py-2 w-23.5 h-11.25 rounded-md flex items-center gap-2 text-sm transition ${
            view === "list"
              ? "bg-brand-light text-brand-dark font-medium"
              : "bg-bg-content text-text-secondary hover:bg-brand-light hover:text-brand-dark"
          }`}
        >
          <Image src={Taches} alt="" width={18} height={18} aria-hidden="true" />
          Liste
        </button>

        <button
          type="button"
          onClick={() => onViewChange("kanban")}
          aria-pressed="false"
          className={`px-3 py-2 w-23.5 h-11.25 rounded-md flex items-center gap-2 text-sm transition ${
            view === "kanban"
              ? "bg-brand-light text-brand-dark font-medium"
              : "bg-bg-content text-text-secondary hover:bg-brand-light hover:text-brand-dark"
          }`}
        >
          <Image src={Kanban} alt="" width={18} height={18} aria-hidden="true" />
          Kanban
        </button>
      </div>

    </div>
  );
}