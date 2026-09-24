"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock } from "lucide-react";

import { PhotoPicker } from "@/components/photo/photo-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubscriptionRequiredBanner } from "@/components/billing/subscription-required-banner";

function nowForInput() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export function MealCaptureForm() {
  const router = useRouter();
  const [file, setFile] = useState<Blob | null>(null);
  const [showDate, setShowDate] = useState(false);
  const [mealDate, setMealDate] = useState("");
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
    if (showDate && mealDate) formData.append("mealDate", mealDate);

    try {
      const res = await fetch("/api/meals/analyze", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        if (data.error === "subscription_required") {
          setSubscriptionRequired(true);
        } else if (data.error === "no_meal_detected") {
          setError(
            data.reason
              ? `${data.reason}. Réessayez avec une photo de votre assiette, bien éclairée et cadrée de près.`
              : "Nous n'avons pas identifié de repas sur cette photo. Réessayez avec une photo de votre assiette, bien éclairée et cadrée de près."
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

      {showDate ? (
        <div className="flex flex-col gap-2">
          <Label htmlFor="meal-date">Date et heure de ce repas</Label>
          <Input
            id="meal-date"
            type="datetime-local"
            value={mealDate}
            max={nowForInput()}
            onChange={(e) => setMealDate(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Utile pour cataloguer un repas d&apos;un jour que vous avez manqué.
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            setShowDate(true);
            setMealDate(nowForInput());
          }}
          className="flex w-fit items-center gap-2 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          <CalendarClock className="h-4 w-4" /> Ce n&apos;est pas un repas d&apos;aujourd&apos;hui ?
        </button>
      )}

      {subscriptionRequired && <SubscriptionRequiredBanner />}
      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button size="lg" onClick={handleSubmit} disabled={!file || isSubmitting}>
        {isSubmitting ? "Analyse en cours…" : "Analyser mon repas"}
      </Button>
    </div>
  );
}
