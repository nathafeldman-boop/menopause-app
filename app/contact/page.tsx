import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import { APP_NAME } from "@/lib/brand";

export const metadata: Metadata = { title: "Contact" };

const CONTACT_EMAIL = "contact@alma-app.fr";

export default function ContactPage() {
  return (
    <LegalPage title="Contact">
      <p>
        Une question sur {APP_NAME}, sur vos données personnelles, ou sur votre abonnement ?
        Écrivez-nous, nous vous répondons dans les meilleurs délais.
      </p>
      <p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-lg font-medium text-primary underline underline-offset-4"
        >
          {CONTACT_EMAIL}
        </a>
      </p>
      <p>
        Pour toute question médicale ou tout symptôme, {APP_NAME} ne peut pas vous répondre :
        merci de consulter un professionnel de santé.
      </p>
    </LegalPage>
  );
}
