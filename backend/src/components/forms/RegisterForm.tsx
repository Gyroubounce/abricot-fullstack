"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterForm() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerUser(email, password);
      router.push("/auth/login");
    } catch  {
      setError("Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form 
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
      aria-label="Formulaire d'inscription"
    >
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-required="true"
          autoComplete="email"
          className="w-full h-12.5 px-3 py-2 border border-system-neutral rounded-md bg-white text-text-primary focus:ring-2 focus:ring-brand-dark"
          placeholder="exemple@mail.com"
        />
      </div>

      {/* Mot de passe */}
      <div className="flex flex-col gap-1">
        <label 
          htmlFor="password"
          className="text-sm text-text-secondary"
        >
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          aria-required="true"
          autoComplete="new-password"
          className="w-full h-13.25 px-3 py-2 border border-system-neutral rounded-md bg-white text-text-primary focus:ring-2 focus:ring-brand-dark"
          placeholder="••••••••"
        />
      </div>

      {/* Message d'erreur */}
      {error && (
        <p className="text-sm text-system-error">{error}</p>
      )}

      {/* Bouton */}
      <button
        type="submit"
        disabled={loading}
        className="w-62.25 h-12.5 mt-2 py-2 rounded-md text-sm bg-btn-black text-text-white transition-all hover:text-brand-dark hover:bg-bg-content hover:border-brand-dark focus:ring-2 focus:ring-brand-dark disabled:opacity-50"
      >
        {loading ? "Inscription..." : "S'inscrire"}
      </button>
    </form>
  );
}