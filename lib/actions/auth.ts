"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function translateAuthError(message: string): string {
  if (message.includes("Invalid login credentials")) {
    return "Email ou mot de passe incorrect.";
  }
  if (message.includes("already registered") || message.includes("already exists")) {
    return "Un compte existe déjà avec cet email. Essayez de vous connecter.";
  }
  if (message.includes("Email not confirmed")) {
    return "Merci de confirmer votre email avant de vous connecter (vérifiez votre boîte de réception).";
  }
  if (message.includes("Password should be")) {
    return "Le mot de passe doit contenir au moins 8 caractères.";
  }
  return "Une erreur est survenue. Merci de réessayer.";
}

export type AuthActionState = { error: string } | null;

export async function signUpAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Merci de renseigner votre email et un mot de passe." };
  }
  if (password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/confirm?next=/onboarding`,
    },
  });

  if (error) {
    console.error("[auth] signUp error:", error.status, error.message);
    return { error: translateAuthError(error.message) };
  }

  if (data.session) {
    redirect("/onboarding");
  }

  redirect("/signup/verifiez-votre-email");
}

export async function signInAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Merci de renseigner votre email et votre mot de passe." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("[auth] signIn error:", error.status, error.message);
    return { error: translateAuthError(error.message) };
  }

  redirect("/dashboard");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
