"use client";

import { ReactNode } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-bg-dashboard">
      {/* Header */}
      <Header />

      {/* Contenu principal */}
      <main className="flex-1 w-full flex justify-center px-4 md:px-0">
        <div className="w-[1215px]">{children}</div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}