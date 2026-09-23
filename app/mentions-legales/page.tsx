import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import { APP_NAME } from "@/lib/brand";

export const metadata: Metadata = { title: "Mentions légales" };

export default function MentionsLegalesPage() {
  return (
    <LegalPage title="Mentions légales">
      <p>
        <strong>Éditeur du site.</strong> {APP_NAME} est édité à titre individuel. Les
        coordonnées complètes de l&apos;éditeur peuvent être obtenues sur simple demande via la
        page{" "}
        <a href="/contact" className="text-primary underline underline-offset-4">
          Contact
        </a>
        .
      </p>
      <p>
        <strong>Hébergement.</strong> L&apos;application est hébergée par Vercel Inc. Les
        données (comptes, photos, analyses) sont stockées par Supabase, hébergeur
        de base de données et de fichiers.
      </p>
      <p>
        <strong>Nature du service.</strong> {APP_NAME} est un service numérique d&apos;aide et de
        conseils alimentaires généraux, s&apos;appuyant notamment sur des modèles d&apos;intelligence
        artificielle. {APP_NAME} n&apos;est pas un dispositif médical, ne pose aucun diagnostic et
        ne remplace en aucun cas l&apos;avis, le suivi ou la prescription d&apos;un professionnel
        de santé.
      </p>
      <p>
        <strong>Propriété intellectuelle.</strong> L&apos;ensemble des éléments du site (textes,
        graphismes, logo) est protégé par le droit de la propriété intellectuelle. Toute
        reproduction non autorisée est interdite.
      </p>
    </LegalPage>
  );
}
