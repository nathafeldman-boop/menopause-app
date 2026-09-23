import Link from "next/link";

import { APP_NAME } from "@/lib/brand";

const LEGAL_LINKS = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/confidentialite", label: "Confidentialité" },
  { href: "/contact", label: "Contact" },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-border/70 bg-muted/30">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 py-10 text-sm text-muted-foreground">
        <p className="font-heading text-lg font-medium text-foreground">{APP_NAME}</p>
        <p className="max-w-xl">
          {APP_NAME} est un coach alimentaire numérique. Ce service propose des conseils
          alimentaires généraux et prudents ; il ne pose pas de diagnostic médical, ne remplace
          pas l&apos;avis d&apos;un professionnel de santé et ne garantit aucun résultat de perte
          de poids. En cas de doute, de douleur ou de symptôme, consultez votre médecin.
        </p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {LEGAL_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="underline underline-offset-4 hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </div>
        <p className="mt-2 text-xs">
          © {new Date().getFullYear()} {APP_NAME}. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
