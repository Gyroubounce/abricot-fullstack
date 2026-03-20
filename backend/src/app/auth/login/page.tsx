// src/app/auth/login/page.tsx
"use client";

import LoginForm from "@/components/forms/LoginForm";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/app/assets/Union.png";
import ConnexionImg from "@/app/assets/Connexion.jpg";
import GitHubIcon from "@/components/ui/icons/GitHubIcon";

export default function LoginPage() {

    // ✅ Fonction pour rediriger vers GitHub OAuth
  function handleGitHubLogin() {
    console.log("NEXT_PUBLIC_API_URL =", process.env.NEXT_PUBLIC_API_URL);
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/github`;
  }

  return (
    <div className="flex min-h-screen w-container-width justify-center"
    role="main"
    aria-labelledby="login-page-title">

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

               {/* ✅ Bouton GitHub OAuth */}
            <button
              type="button"
              onClick={handleGitHubLogin}
               className="w-62.25 h-12.5 flex items-center justify-center gap-3 border border-btn-black rounded-[8px] bg-btn-black text-text-white hover:bg-bg-content hover:text-brand-dark hover:border-brand-dark transition mb-4"
              aria-label="Se connecter avec GitHub"
            >
              <GitHubIcon />
              <span className="text-base">
                Continuer avec GitHub
              </span>
            </button>

            {/* ✅ Séparateur "Ou" */}
            <div className="relative w-full mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-system-neutral"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-bg-dashboard text-sm text-text-secondary">
                  Ou
                </span>
              </div>
            </div>

            {/* Formulaire */}
            <LoginForm/>

            {/* Mot de passe oublié centré */}
            <div className="w-70.75 text-center mt-4">
              <div
               
                className="text-brand-dark text-sm underline focus:ring-2 focus:ring-brand-dark"
                aria-label="Récupérer votre mot de passe"
              >
                Mot de passe oublié ?
              </div>
            </div>
          </div>
        </div>

        {/* Lien inscription en bas, marge bottom 60px */}
        <p className="mt-auto mb-15 text-center text-sm text-text-primary">
          Pas encore de compte ?{" "}
          <Link href="/auth/register" className=" text-brand-dark underline focus:ring-2 focus:ring-brand-dark" aria-label="Créer un compte Abricot">
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