import type { Metadata, Viewport } from "next";
import { Nunito, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-player" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-admin" });

export const metadata: Metadata = {
  title: "BirdLeague — Ensine. Evolua. Voe.",
  description: "Uma jornada de Inglês onde cada resposta ajuda seu Bloo a crescer.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#087CC1" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${nunito.variable} ${jakarta.variable}`}>{children}</body>
    </html>
  );
}
