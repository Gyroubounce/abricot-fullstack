
import "./globals.css";
import { Inter, Manrope } from "next/font/google";
import { Providers } from "@/app/Providers";

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
         <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}