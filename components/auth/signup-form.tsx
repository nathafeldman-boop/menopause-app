"use client";

import { useActionState } from "react";
import Link from "next/link";

import { signUpAction, type AuthActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignupForm() {
  const [state, formAction, isPending] = useActionState<AuthActionState, FormData>(
    signUpAction,
    null
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Adresse email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required placeholder="vous@exemple.com" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="8 caractères minimum"
        />
      </div>
      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
      <Button type="submit" size="lg" disabled={isPending} className="mt-1">
        {isPending ? "Création du compte…" : "Créer mon compte"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        En créant un compte, vous acceptez que ce service propose des conseils alimentaires
        généraux et ne remplace pas l&apos;avis d&apos;un professionnel de santé.
      </p>
      <p className="text-center text-sm text-muted-foreground">
        Déjà un compte ?{" "}
        <Link href="/login" className="text-primary underline underline-offset-4">
          Me connecter
        </Link>
      </p>
    </form>
  );
}
