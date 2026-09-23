"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { PhotoPicker } from "@/components/photo/photo-picker";
import { Button } from "@/components/ui/button";
import { SubscriptionRequiredBanner } from "@/components/billing/subscription-required-banner";

export function RecipeCaptureForm() {
  const router = useRouter();
  const [file, setFile] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionRequired, setSubscriptionRequired] = useState(false);

  async function handleSubmit() {
    if (!file) return;
    setIsSubmitting(true);
    setError(null);
    setSubscriptionRequired(false);

    const formData = new FormData();
    formData.append("photo", file, "recette.jpg");

    try {
      const res = await fetch("/api/recipes/scan", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        if (data.error === "subscription_required") {
          setSubscriptionRequired(true);
        } else {
          setError("Une erreur est survenue pendant la lecture de la recette. Merci de réessayer.");
        }
        setIsSubmitting(false);
        return;
      }

      router.push(`/recette/${data.id}`);
    } catch {
      setError("Une erreur est survenue. Vérifiez votre connexion et réessayez.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PhotoPicker
        label="Photographier une recette"
        helper="Photo, capture d'écran ou page de livre de recette"
        onReady={(blob) => setFile(blob)}
      />

      {subscriptionRequired && <SubscriptionRequiredBanner />}
      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button size="lg" onClick={handleSubmit} disabled={!file || isSubmitting}>
        {isSubmitting ? "Lecture en cours…" : "Analyser cette recette"}
      </Button>
    </div>
  );
}
