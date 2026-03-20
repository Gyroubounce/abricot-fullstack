"use client";

import { EyeIcon } from '@heroicons/react/24/outline';
import { EyeSlashIcon } from "@heroicons/react/20/solid"; 
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setError("");

try {
  await login(email, password);
  router.push("/dashboard");
} catch {
  setError("Identifiants incorrects");
}

}

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
      aria-label="Formulaire de connexion"
    >
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Email */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="email"
          className="text-sm text-text-secondary"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full h-12.5 px-3 py-2 border border-system-neutral rounded-md bg-white text-text-primary"
          placeholder="exemple@mail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

     {/* Mot de passe */}
      <div className="flex flex-col gap-1 relative">
        <label
          htmlFor="password"
          className="text-sm text-text-secondary"
        >
          Mot de passe
        </label>

        <div className="relative w-full">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"} // toggle type
            required
            autoComplete="current-password"
            className="w-full h-13.25 px-3 py-2 border border-system-neutral rounded-md bg-white text-text-primary pr-10" // pr-10 pour laisser de la place à l'icône
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Bouton pour afficher/masquer le mot de passe */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary"
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

      {/* Bouton */}
      <button
        type="submit"
        className="w-62.25 h-12.5 mt-2 py-2 rounded-md text-sm bg-btn-black text-text-white border border-transparent transition-all hover:text-brand-dark hover:bg-bg-content hover:border-brand-dark focus:ring-2 focus:ring-brand-dark"
      >
        Se connecter
      </button>
    </form>
  );
}