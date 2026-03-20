"use client";

import { useAuth } from "@/hooks/useAuth";
import AccountForm from "@/components/forms/AccountForm";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <p
        role="status"
        aria-live="polite"
        className="text-text-secondary text-sm"
      >
        Chargement du profil...
      </p>
    );
  }

  const handleLogout = async () => {
    await logout();       
    router.push("/auth/login"); 
  };

  return (
    <main
      className="min-h-screen bg-bg-dashboard py-12 px-4"
      aria-labelledby="account-title"
    >
      <div className="max-w-303.75 mx-auto bg-bg-content rounded-[8px] shadow-card p-10">

        {/* Header avec titre + logout */}
        <header className="flex items-center justify-between mb-2">
          <h1
            id="account-title"
            className="text-lg font-semibold text-text-primary"
          >
            Mon compte
          </h1>

          <button
            onClick={handleLogout}
            type="button"
            aria-label="Se déconnecter du compte"
            className="text-sm text-brand-dark underline hover:opacity-80 transition focus:outline-none focus:ring-2 focus:ring-brand-dark rounded"
          >
            Déconnexion
          </button>
        </header>

        {/* Infos utilisateur */}
        <section
          aria-label="Informations actuelles du compte"
          className="mb-8"
        >
          <p className="text-base text-text-secondary">{user.name}</p>
        </section>

        {/* Formulaire */}
        <section aria-label="Modifier les informations du compte">
          <AccountForm />
        </section>

      </div>
    </main>
  );
}