import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alma — Bien manger pendant la ménopause",
  description:
    "Photographiez votre repas, votre recette ou vos ingrédients. Votre coach alimentaire vous aide à mieux manger pendant la périménopause et la ménopause, sans régime compliqué.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Alma",
  },
};

export const viewport: Viewport = {
  themeColor: "#fdf1f4",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
