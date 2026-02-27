// src/app/auth/login/page.tsx
"use client";

import LoginForm from "@/components/forms/LoginForm";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/app/assets/Union.png";
import ConnexionImg from "@/app/assets/Connexion.jpg";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-container-width justify-center">

      {/* Colonne gauche */}
      <div className="w-140.5 max-w-full flex flex-col items-center bg-bg-dashboard px-4">

        {/* Logo centré en haut */}
        <div className="mt-15">
          <Image src={Logo} alt="Logo" width={252} priority/>
        </div>

        {/* Container centré verticalement */}
        <div className="flex-1 flex flex-col justify-center items-center w-full">
          {/* Container formulaire (283px de large) */}
          <div className="w-70.75 flex flex-col items-center">

            {/* Titre Connexion en orange */}
            <h1 className="text-[40px] font-bold text-brand-dark mb-5">
              Connexion
            </h1>

            {/* Formulaire */}
            <LoginForm/>

            {/* Mot de passe oublié centré */}
            <div className="w-70.75 text-center mt-4">
              <Link
                href="/auth/forgot-password"
                className="text-brand-dark text-sm"
              >
                Mot de passe oublié ?
              </Link>
            </div>
          </div>
        </div>

        {/* Lien inscription en bas, marge bottom 60px */}
        <p className="mt-auto mb-15 text-center text-sm text-text-primary">
          Pas encore de compte ?{" "}
          <Link href="/auth/register" className="text-brand-dark">
            Créer un compte
          </Link>
        </p>
      </div>

      {/* Colonne droite : image */}
      <div className="hidden md:block w-1/2">
        <Image
          src={ConnexionImg}
          alt="Connexion"
          className="object-cover h-full"
          priority
        />
      </div>
    </div>
  );
}