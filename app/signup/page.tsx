import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = { title: "Créer un compte" };

export default function SignupPage() {
  return (
    <AuthShell
      title="Créons votre compte"
      subtitle="2 minutes suffisent pour commencer votre accompagnement."
    >
      <SignupForm />
    </AuthShell>
  );
}
