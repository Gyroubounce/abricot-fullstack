// src/components/layout/Footer.tsx

import Image from "next/image"; 
import Logo from "@/app/assets/Logo.png";

export default function Footer() {
  return (
    <footer className="w-full bg-white flex justify-center border-t border-system-neutral mt-10"
    aria-label="Pied de page">
      <div className="w-full max-w-max-[1440px] h-18 flex items-center justify-between px-10">
                {/* Logo image */}
        <div className="flex items-center">
          <Image src={Logo} alt="Abricot - Accueil" width={120}  priority style={{ height: "auto" }} />
        </div>

        <span className="text-[14px] text-text-secondary">
          Abricot 2025
        </span>
      </div>
    </footer>
  );
}
