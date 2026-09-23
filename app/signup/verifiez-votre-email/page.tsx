import type { Metadata } from "next";
import { Mail } from "lucide-react";

import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = { title: "Vérifiez votre email" };

export default function VerifyEmailPage() {
  return (
    <AuthShell
      title="Vérifiez votre boîte mail"
      subtitle="Nous venons de vous envoyer un lien pour confirmer votre compte."
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground">
          Cliquez sur le lien reçu par email pour activer votre compte et commencer votre
          accompagnement. Pensez à vérifier vos courriers indésirables si vous ne le voyez pas
          sous quelques minutes.
        </p>
      </div>
    </AuthShell>
  );
}
