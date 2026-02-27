// src/components/forms/LoginForm.tsx
"use client";

export default function LoginForm() {
  return (
    <form className="flex flex-col gap-4">

      {/* Email */}
      <div className="flex flex-col gap-1">
        <label className="text-sm  text-text-secondary">
          Email
        </label>
        <input
          type="email"
          className="w-full h-12.5 px-3 py-2 border border-system-neutral rounded-md bg-white text-text-primary"
          placeholder="exemple@mail.com"
        />
      </div>

      {/* Mot de passe */}
      <div className="flex flex-col gap-1">
        <label className="text-sm  text-text-secondary">
          Mot de passe
        </label>
        <input
          type="password"
          className="w-full h-13.25 px-3 py-2 border border-system-neutral rounded-md bg-white text-text-primary"
          placeholder="••••••••"
        />
      </div>

      {/* Bouton */}
      <button
        type="submit"
        className="w-62.25 h-12.5 mt-2 py-2 rounded-md bg-black text-white text-sm" 
      >
        Se connecter
      </button>
    </form>
  );
}