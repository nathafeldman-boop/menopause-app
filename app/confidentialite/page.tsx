import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import { APP_NAME } from "@/lib/brand";

export const metadata: Metadata = { title: "Confidentialité" };

export default function ConfidentialitePage() {
  return (
    <LegalPage title="Confidentialité">
      <p>
        <strong>Vos données vous appartiennent.</strong> Les photos que vous envoyez (repas,
        recettes, ingrédients) et les analyses générées sont strictement personnelles. Elles ne
        sont ni partagées, ni revendues à des tiers, ni utilisées à des fins publicitaires.
      </p>
      <p>
        <strong>Ce que nous stockons.</strong> Votre email, vos réponses au questionnaire de
        personnalisation, vos photos, vos analyses et conversations avec le coach, ainsi que
        l&apos;état de votre abonnement. Ces données sont hébergées de façon sécurisée par
        Supabase et protégées par des règles d&apos;accès garantissant que seule vous pouvez
        consulter vos propres données.
      </p>
      <p>
        <strong>Intelligence artificielle.</strong> Vos photos et messages peuvent être transmis
        à un fournisseur d&apos;IA (Google Gemini) dans le seul but de générer votre analyse ou la
        réponse du coach. Ils ne sont pas utilisés pour ré-entraîner des modèles pour le compte de
        tiers.
      </p>
      <p>
        <strong>Paiement.</strong> Aucune donnée bancaire n&apos;est stockée par {APP_NAME} : les
        paiements sont gérés par un prestataire de paiement tiers sécurisé.
      </p>
      <p>
        <strong>Vos droits.</strong> Vous pouvez à tout moment demander l&apos;accès, la
        correction ou la suppression de vos données en nous contactant depuis la page{" "}
        <a href="/contact" className="text-primary underline underline-offset-4">
          Contact
        </a>
        .
      </p>
    </LegalPage>
  );
}
