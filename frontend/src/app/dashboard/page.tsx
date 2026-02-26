// src/app/dashboard/page.tsx
"use client"; // si tu utilises des hooks ou state

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#F9FAFB] p-6">
      <h1 className="text-2xl font-manrope font-bold text-[#1F1F1F]">
        Tableau de bord
      </h1>
      <p className="text-[#6B7280] mt-2">
        Bonjour [Prénom Nom], voici un aperçu de vos projets et tâches
      </p>
    </main>
  );
}