
import "./globals.css";
import { Inter, Manrope } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata = {
  title: "Abricot Dashboard",
  description: "Dashboard UI - Thème Abricot",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${manrope.variable}`}
    >
      <body>
         <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}