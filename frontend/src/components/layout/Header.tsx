// src/components/layout/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const isDashboard = pathname === "/dashboard";
  const isProjets = pathname.startsWith("/projets");
  const isProfile = pathname === "/auth/profile";

  return (
    <header className="w-full bg-black/5 flex justify-center">
      <div className="max-w-[1215px] w-full h-18 flex items-center justify-between px-4">

        {/* Logo */}
        <Link
          href="/dashboard"
          className="text-2xl font-manrope font-bold"
        >
          Abricot
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className={`px-4 py-2 rounded-md text-sm font-inter ${
              isDashboard
                ? "bg-black text-white"
                : "bg-white text-brand-dark border border-brand-dark"
            }`}
          >
            Tableau de bord
          </Link>

          <Link
            href="/projets"
            className={`px-4 py-2 rounded-md text-sm font-inter ${
              isProjets
                ? "bg-black text-white"
                : "bg-white text-brand-dark border border-brand-dark"
            }`}
          >
            Projets
          </Link>
        </nav>

        {/* Bouton AD */}
         <Link
          href="/auth/profile"
          className={`w-10 h-10 rounded-full bg-brand-light flex items-center justify-center font-manrope font-semibold text-brand-dark
            ${isProfile ? "ring-2 ring-black" : ""} `}
        >
          AD
        </Link>

      </div>
    </header>
  );
}