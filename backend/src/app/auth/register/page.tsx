// src/app/auth/login/page.tsx
"use client";

import LoginForm from "@/components/forms/RegisterForm";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/app/assets/Union.png";
import ConnexionImg from "@/app/assets/Connexion.jpg";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen w-container-width justify-center"
    role="main"
    aria-labelledby="register-page-title">

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
              Inscription
            </h1>

            {/* Formulaire */}
            <LoginForm/>

          </div>
        </div>

        {/* Lien inscription en bas, marge bottom 60px */}
        <p className="mt-auto mb-15 text-center text-sm text-text-primary">
          Déjà inscrit ?{" "}
          <Link href="/auth/login" className="text-brand-dark underline focus:ring-2 focus:ring-brand-dark"
          aria-label="Se connecter à votre compte Abricot">
            Se connecter
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