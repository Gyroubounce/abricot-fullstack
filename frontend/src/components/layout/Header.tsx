// src/components/layout/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { getInitials } from "@/lib/utils/initials";
import Logo from "@/app/assets/Union.png";
import dashboard from "@/app/assets/dashboard.png";
import dashboardOrange from "@/app/assets/dashboard_orange.png";
import projets from "@/app/assets/projets.png";
import projetsWhite from "@/app/assets/projets_blanc.png";

export default function Header() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isDashboard = pathname === "/dashboard";
  const isProjets = pathname.startsWith("/dashboard/projects");
  const isProfile = pathname === "/dashboard/account";

  return (
    <header className="w-full bg-white flex justify-center">
      <div className="max-w-303.75 w-full h-[94px] flex items-center justify-between px-4">

        {/* Logo */}
        <Link
          href="/dashboard"
          className="text-2xl"
          aria-label="Retour au tableau de bord"
        >
          <Image src={Logo} alt="Logo Abricot" width={147} priority />
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          <Link
            href="/dashboard"
            aria-current={isDashboard ? "page" : undefined}
            className={`
              group relative
              w-62 h-19.5
              flex items-center justify-center gap-3
              rounded-md text-sm
              transition-colors
              ${isDashboard
                ? "bg-black text-white"
                : "bg-white text-brand-dark border border-brand-dark"
              }
            `}
          >
            <span className="relative w-5 h-5 flex items-center justify-center">
              <Image
                src={isDashboard ? dashboard : dashboardOrange}
                alt="Dashboard"
                width={20}
                height={20}
                aria-hidden="true"
                className="transition-opacity group-hover:opacity-0"
              />
              <Image
                src={dashboardOrange}
                alt="DashboardOrange"
                width={20}
                height={20}
                aria-hidden="true"
                className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </span>
            Tableau de bord
          </Link>

          <Link
            href="/dashboard/projects"
            aria-current={isProjets ? "page" : undefined}
            className={`
              group relative
              w-62 h-19.5
              flex items-center justify-center gap-3
              rounded-md text-sm
              transition-colors
              ${isProjets
                ? "bg-black text-white"
                : "bg-white text-brand-dark border border-brand-dark"
              }
            `}
          >
            <span className="relative w-5 h-5 flex items-center justify-center">
              <Image
                src={isProjets ? projetsWhite : projets}
                alt="Projets"
                width={20}
                height={20}
                aria-hidden="true"
                className="transition-opacity group-hover:opacity-0"
              />
              <Image
                src={projets}
                alt="Projets"
                width={20}
                height={20}
                aria-hidden="true"
                className="absolute top-0.5 left-0 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </span>
            Projets
          </Link>
        </nav>

        {/* Avatar utilisateur */}
        <Link
          href="/dashboard/account"
          aria-label="Accéder à mon profil"
          aria-current={isProfile ? "page" : undefined}
          className={`w-16.25 h-16.25 rounded-full flex items-center justify-center font-semibold text-sm transition
            ${isProfile
              ? "bg-brand-dark text-white"
              : "bg-brand-light text-brand-dark hover:ring-1 hover:ring-brand-dark"
            }`}
                  >
          {user ? getInitials(user.name) : "?"}
        </Link>

      </div>
    </header>
  );
}