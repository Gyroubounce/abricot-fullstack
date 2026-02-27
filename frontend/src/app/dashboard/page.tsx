export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">

      {/* Titre + bouton */}
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-manrope font-semibold">
          Tableau de bord
        </h1>

        <button className="px-4 py-2 rounded-md bg-brand-dark text-white font-manrope">
          + Créer un projet
        </button>
      </div>

      {/* Boutons Liste / Kanban */}
      <div className="flex gap-3">
        <button className="px-4 py-2 rounded-md bg-black text-white font-inter">
          Liste
        </button>

        <button className="px-4 py-2 rounded-md bg-white border border-brand-dark text-brand-dark font-inter">
          Kanban
        </button>
      </div>

      {/* Section Mes tâches */}
      <div className="flex flex-col gap-4">
        <h2 className="text-[20px] font-manrope font-semibold">
          Mes tâches assignées
        </h2>

        <div className="grid grid-cols-3 gap-4">

          {/* Carte tâche */}
          <div className="bg-white shadow-(--shadow-card) rounded-(--radius-card) p-4 border border-system-neutral">
            <p className="font-manrope font-semibold text-text-primary">
              Intégrer le Header Abricot
            </p>
            <p className="text-text-secondary text-sm mt-1">
              Projet Abricot
            </p>
          </div>

          <div className="bg-white shadow-(--shadow-card) rounded-(--radius-card) p-4 border border-system-neutral">
            <p className="font-manrope font-semibold text-text-primary">
              Créer la page Dashboard
            </p>
            <p className="text-text-secondary text-sm mt-1">
              Projet Abricot
            </p>
          </div>

          <div className="bg-white shadow-(--shadow-card) rounded-(--radius-card) p-4 border border-system-neutral">
            <p className="font-manrope font-semibold text-text-primary">
              Styliser les composants
            </p>
            <p className="text-text-secondary text-sm mt-1">
              Projet Abricot
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
