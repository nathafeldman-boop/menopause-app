"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { SubscriptionRequiredBanner } from "@/components/billing/subscription-required-banner";

export function AdaptRecipeButton({ recipeId }: { recipeId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionRequired, setSubscriptionRequired] = useState(false);

  async function handleClick() {
    setLoading(true);
    setError(null);
    setSubscriptionRequired(false);

    try {
      const res = await fetch("/api/recipes/adapt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.error === "subscription_required") {
          setSubscriptionRequired(true);
        } else if (data.error === "rescan_required") {
          setError(
            "Cette recette n'a été qu'aperçue, pas scannée en entier. Scannez-la à nouveau pour l'adapter."
          );
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
        {loading ? "Adaptation en cours…" : "Adapter cette recette pour moi"}
      </Button>
      {subscriptionRequired && <SubscriptionRequiredBanner />}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
