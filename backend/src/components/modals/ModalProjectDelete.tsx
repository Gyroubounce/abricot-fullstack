"use client";

type Props = {
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export default function ModalProjectDelete({ onClose, onConfirm }: Props) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-project-title"
    >
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        
        <h2 id="delete-project-title" className="text-xl font-semibold mb-2">
          Supprimer le projet
        </h2>

        <p className="text-sm text-gray-600 mb-6">
          Cette action est irréversible. Voulez-vous vraiment supprimer ce projet ?
        </p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm bg-gray-200 hover:bg-gray-300 transition"
          >
            Annuler
          </button>

          <button
            type="button"
            aria-label="Confirmer suppression projet"
            onClick={onConfirm}
            className="px-4 py-2 rounded-md text-sm bg-red-600 text-white hover:bg-red-700 transition"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}
