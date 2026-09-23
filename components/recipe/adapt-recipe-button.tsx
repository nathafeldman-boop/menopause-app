"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function AdaptRecipeButton({ recipeId }: { recipeId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insufficientCredits, setInsufficientCredits] = useState(false);

  async function handleClick() {
    setLoading(true);
    setError(null);
    setInsufficientCredits(false);

    try {
      const res = await fetch("/api/recipes/adapt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.error === "insufficient_credits") {
          setInsufficientCredits(true);
        } else {
          setError("Une erreur est survenue. Merci de réessayer.");
        }
        setLoading(false);
        return;
      }

      router.refresh();
    } catch {
      setError("Une erreur est survenue. Vérifiez votre connexion.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={handleClick} disabled={loading} size="lg">
        {loading ? "Adaptation en cours…" : "Adapter cette recette pour moi (5 crédits)"}
      </Button>
      {insufficientCredits && (
        <p className="text-sm text-warning">
          Solde insuffisant.{" "}
          <Link href="/abonnement" className="underline underline-offset-4">
            Voir les options
          </Link>
        </p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
