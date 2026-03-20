"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function AccountForm() {
  const { user, refreshProfile } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false); // ✅ Nouveau

  useEffect(() => {
    // ✅ Ne remplir les champs qu'UNE SEULE FOIS au chargement
    if (user && !isInitialized) {
      const parts = (user.name || "").split(" ");
      setFirstName(parts[0] || "");
      setLastName(parts.slice(1).join(" ") || "");
      setEmail(user.email || "");
      setIsInitialized(true); // ✅ Marquer comme initialisé
    }
  }, [user, isInitialized]); // ✅ Ajouter isInitialized dans les dépendances

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

     try {
    const newName = `${firstName} ${lastName}`.trim();
    const hasChanges = 
      newName !== (user?.name || "") || 
      email !== (user?.email || "") || 
      password !== "";

    // ✅ Si rien n'a changé, ne rien faire
    if (!hasChanges) {
      setMessage("Aucune modification détectée.");
      setLoading(false);
      return;
    }

    const body: { name: string; email: string; password?: string } = {
      name: newName,
      email,
    };
      if (password) body.password = password;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erreur lors de la mise à jour");
      }

      setMessage("Profil mis à jour avec succès.");
      setPassword("");
      
       // ✅ Attendre un peu avant de rafraîchir pour éviter le "saut"
      await new Promise(resolve => setTimeout(resolve, 100));
      await refreshProfile();
      
    
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Une erreur est survenue");
      } else {
        setError("Une erreur est survenue");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5"
      aria-label="Formulaire de modification du profil"
      noValidate
    >

      {/* Nom */}
      <div className="flex flex-col gap-1">
        <label htmlFor="lastName" className="text-sm text-text-primary">
          Nom
        </label>
        <input
          id="lastName"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="border border-system-neutral  px-4 py-2.5 text-text-secondary bg-bg-content transition"
          placeholder="Votre nom"
          autoComplete="family-name"
          aria-required="true"
          required
        />
      </div>

      {/* Prénom */}
      <div className="flex flex-col gap-1">
        <label htmlFor="firstName" className="text-sm text-text-primary">
          Prénom
        </label>
        <input
          id="firstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="border border-system-neutral  px-4 py-2.5  text-text-secondary bg-bg-content transition"
          placeholder="Votre prénom"
          autoComplete="given-name"
          aria-required="true"
          required
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm text-text-primary">
          Adresse email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-system-neutral px-4 py-2.5  text-text-secondary bg-bg-content transition"
          placeholder="votre@email.com"
          autoComplete="email"
          aria-required="true"
          required
        />
      </div>

      {/* Mot de passe */}
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm text-text-primary">
          Mot de passe 
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-system-neutral px-4 py-2.5 pr-11 text-sm text-text-secondary bg-bg-content transition"
            placeholder="••••••••"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition"
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Message succès */}
      {message && (
        <p id="form-success" role="status" aria-live="polite" className="text-sm text-system-success">
          {message}
        </p>
      )}

      {/* Message erreur */}
      {error && (
        <p id="form-error" role="alert" aria-live="assertive" className="text-sm text-system-error">
          {error}
        </p>
      )}

      {/* Bouton */}
      <button
        type="submit"
        disabled={loading}
        className="mt-3 w-60.5 h-12.5 px-6 py-2.5 bg-btn-black text-text-white text-base rounded-[10px] hover:border border-brand-dark hover:bg-bg-content hover:text-brand-dark"
      >
        {loading ? "Enregistrement en cours..." : "Modifier les informations"}
      </button>

    </form>
  );
}