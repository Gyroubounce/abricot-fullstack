// src/app/(dashboard)/layout.tsx

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value; // cookie http-only du backend

  if (!token) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-bg-dashboard flex flex-col">
      <Header />

      <main className="flex justify-center w-full flex-1">
        <div className="w-full max-w-303.75 py-10 px-4">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}