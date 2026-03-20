import ListIcon from "@/components/ui/icons/ListIcon";
import KanbanIcon from "@/components/ui/icons/CalenderIcon";
import Button from "@/components/ui/Button";

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
          <h1 className="text-[28px] font-semibold text-text-primary">
            Tableau de bord
          </h1>
          <p className="text-[18px] text-black leading-snug">
            <span className="block md:inline">Bonjour {name}, </span>
            <span className="block md:inline">voici un aperçu de vos projets et tâches.</span>
          </p>
        </div>

        <Button 
        variant="creer-projet" 
        onClick={() => onCreateProject()} 
        ariaLabel="Créer un nouveau projet"
        className="flex items-center justify-center gap-2 mr-5 md:mr-0">
          <span>+</span>
          <span className="hidden md:inline">Créer un projet</span>
        </Button>
      </div>

      {/* Boutons Liste / Kanban */}
      <div className="flex gap-3" role="group" aria-label="Mode d'affichage">
        <button
          type="button"
          onClick={() => onViewChange("list")}
          aria-pressed="false"
          className={`px-4 py-2 w-23.5 h-11.25 rounded-md flex items-center gap-3 text-sm transition ${
            view === "list"
              ? "bg-brand-light text-brand-dark font-medium"
              : "bg-bg-content text-brand-dark hover:bg-brand-light hover:text-brand-dark"
          }`}
        >
          <ListIcon className="w-4 h-4" aria-hidden="true" />
          Liste
        </button>

        <button
          type="button"
          onClick={() => onViewChange("kanban")}
          aria-pressed="false"
          className={`px-3 py-2 rounded-md flex items-center gap-3 text-sm transition ${
            view === "kanban"
              ? "bg-brand-light text-brand-dark font-medium"
              : "bg-bg-content text-brand-dark hover:bg-brand-light hover:text-brand-dark"
          }`}
        >
          <KanbanIcon className="w-5 h-5 shrink-0" aria-hidden="true" />
          Kanban
        </button>
      </div>

    </div>
  );
}