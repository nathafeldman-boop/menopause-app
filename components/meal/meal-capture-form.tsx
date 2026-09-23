"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { PhotoPicker } from "@/components/photo/photo-picker";
import { Button } from "@/components/ui/button";
import { SubscriptionRequiredBanner } from "@/components/billing/subscription-required-banner";

export function MealCaptureForm() {
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
    formData.append("photo", file, "repas.jpg");

    try {
      const res = await fetch("/api/meals/analyze", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        if (data.error === "subscription_required") {
          setSubscriptionRequired(true);
        } else if (data.error === "no_meal_detected") {
          setError(
            "Nous n'avons pas identifié de repas sur cette photo. Réessayez avec une photo de votre assiette, bien éclairée et cadrée de près."
          );
        } else {
          setError("Une erreur est survenue pendant l'analyse. Merci de réessayer.");
        }
        setIsSubmitting(false);
        return;
      }

      router.push(`/repas/${data.id}`);
    } catch {
      setError("Une erreur est survenue. Vérifiez votre connexion et réessayez.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PhotoPicker label="Photographier mon repas" onReady={(blob) => setFile(blob)} />

      {subscriptionRequired && <SubscriptionRequiredBanner />}
      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button size="lg" onClick={handleSubmit} disabled={!file || isSubmitting}>
        {isSubmitting ? "Analyse en cours…" : "Analyser mon repas"}
      </Button>
    </div>
  );
}
