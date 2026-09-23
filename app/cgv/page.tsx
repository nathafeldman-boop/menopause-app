import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import { APP_NAME } from "@/lib/brand";
import { PLANS } from "@/lib/billing";

export const metadata: Metadata = { title: "Conditions générales de vente" };

export default function CgvPage() {
  return (
    <LegalPage title="Conditions générales de vente">
      <p>
        Les présentes conditions générales de vente (CGV) s&apos;appliquent à tout abonnement
        souscrit sur {APP_NAME}. En vous abonnant, vous acceptez sans réserve les présentes
        conditions.
      </p>

      <p>
        <strong>1. Objet.</strong> {APP_NAME} propose un accompagnement alimentaire numérique par
        abonnement : analyse de repas en photo, adaptation de recettes, recettes à partir
        d&apos;ingrédients, coach conversationnel et plan de repas. Il ne s&apos;agit pas d&apos;un
        dispositif médical ; {APP_NAME} ne diagnostique rien et ne remplace pas l&apos;avis
        d&apos;un professionnel de santé.
      </p>

      <p>
        <strong>2. Formules et prix.</strong> Deux formules sont proposées : l&apos;abonnement{" "}
        {PLANS.weekly.label.toLowerCase()} à {PLANS.weekly.price} {PLANS.weekly.period}, et
        l&apos;abonnement {PLANS.monthly.label.toLowerCase()} à {PLANS.monthly.price}{" "}
        {PLANS.monthly.period}. Les prix sont indiqués en euros, toutes taxes comprises. Ils
        peuvent être amenés à évoluer ; toute modification est annoncée avant son entrée en
        vigueur et ne s&apos;applique jamais rétroactivement à une période déjà payée.
      </p>

      <p>
        <strong>3. Paiement.</strong> Le paiement est exigible immédiatement lors de la
        souscription, puis à chaque échéance (hebdomadaire ou mensuelle) tant que
        l&apos;abonnement n&apos;a pas été résilié. Aucune donnée bancaire n&apos;est stockée par{" "}
        {APP_NAME} : les paiements sont traités par un prestataire de paiement tiers sécurisé.
      </p>

      <p>
        <strong>4. Durée et reconduction.</strong> L&apos;abonnement est reconduit
        automatiquement à chaque échéance (semaine ou mois), sauf résiliation de votre part avant
        la date de renouvellement. La résiliation prend effet à la fin de la période déjà payée :
        elle n&apos;ouvre pas droit à un remboursement de la période en cours.
      </p>

      <p>
        <strong>5. Résiliation.</strong> Vous pouvez résilier votre abonnement à tout moment,
        sans justification ni frais, depuis votre profil dans l&apos;application. L&apos;accès aux
        fonctionnalités réservées aux abonnées reste actif jusqu&apos;à la fin de la période déjà
        payée.
      </p>

      <p>
        <strong>6. Droit de rétractation.</strong> Conformément au Code de la consommation, vous
        disposez en principe d&apos;un délai de 14 jours pour renoncer à votre abonnement sans
        justification. Toutefois, en souscrivant un abonnement, vous demandez expressément à
        bénéficier du service dès la confirmation du paiement ; une fois le contenu numérique
        pleinement exécuté ou son exécution commencée avec votre accord exprès, le droit de
        rétractation ne peut plus être exercé, conformément à l&apos;article L221-28 du Code de la
        consommation.
      </p>

      <p>
        <strong>7. Responsabilité.</strong> {APP_NAME} fournit des conseils alimentaires généraux,
        sans garantie de résultat, notamment en matière de perte de poids ou d&apos;amélioration de
        symptômes. En cas de doute, de douleur ou de symptôme, consultez un professionnel de
        santé.
      </p>

      <p>
        <strong>8. Données personnelles.</strong> Le traitement de vos données est décrit sur la
        page{" "}
        <a href="/confidentialite" className="text-primary underline underline-offset-4">
          Confidentialité
        </a>
        .
      </p>

      <p>
        <strong>9. Droit applicable et litiges.</strong> Les présentes CGV sont soumises au droit
        français. En cas de litige, vous pouvez nous contacter via la page{" "}
        <a href="/contact" className="text-primary underline underline-offset-4">
          Contact
        </a>{" "}
        avant toute action judiciaire, afin de rechercher une solution amiable.
      </p>
    </LegalPage>
  );
}
