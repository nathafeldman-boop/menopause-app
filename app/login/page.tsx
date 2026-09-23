import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Connexion" };

export default function LoginPage() {
  return (
    <AuthShell title="Bon retour" subtitle="Connectez-vous pour retrouver votre coach.">
      <LoginForm />
    </AuthShell>
  );
}
