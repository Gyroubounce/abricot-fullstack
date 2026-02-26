"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const isDashboard = pathname === "/dashboard";
  const isProjets = pathname.startsWith("/projets");

  return (
    <header className="w-full bg-[#00000005] flex justify-center">
      <div className="w-[1215px] h-[72px] flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/dashboard" className="text-[22px] font-manrope font-bold text-text-primary">
          Abricot
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className={`px-4 py-2 rounded-md text-sm font-inter transition-colors duration-150
              ${isDashboard
                ? "bg-brand-dark text-white"
                : "bg-white text-brand-dark border border-brand-dark"
              }`}
          >
            Tableau de bord
          </Link>

          <Link
            href="/projets"
            className={`px-4 py-2 rounded-md text-sm font-inter transition-colors duration-150
              ${isProjets
                ? "bg-brand-dark text-white"
                : "bg-white text-brand-dark border border-brand-dark"
              }`}
          >
            Projets
          </Link>
        </nav>

        {/* Avatar AD */}
        <button className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center font-manrope font-semibold text-brand-dark">
          AD
        </button>
      </div>
    </header>
  );
}