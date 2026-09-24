"use client";

import { useState } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FavoriteButton } from "@/components/favorites/favorite-button";
import { cn } from "@/lib/utils";
import type { GeneratedRecipe } from "@/lib/ai/types";

const TIME_OPTIONS = ["10 min", "20 min", "40 min"];
const CRAVING_OPTIONS = ["Léger", "Gourmand", "Chaud", "Frais"];

type Step = "time" | "craving" | "available" | "loading" | "result";

export function SosFlow() {
  const [step, setStep] = useState<Step>("time");
  const [time, setTime] = useState("");
  const [craving, setCraving] = useState("");
  const [available, setAvailable] = useState("");
  const [suggestion, setSuggestion] = useState<GeneratedRecipe | null>(null);
  const [isTeaser, setIsTeaser] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchSuggestion() {
    setStep("loading");
    setError(null);
    try {
      const res = await fetch("/api/sos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ time, craving, available }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError("Une erreur est survenue. Merci de réessayer.");
        setStep("available");
        return;
      }
      setSuggestion(data.suggestion);
      setIsTeaser(data.isTeaser);
      setStep("result");
    } catch {
      setError("Une erreur est survenue. Vérifiez votre connexion.");
      setStep("available");
    }
  }

  function reset() {
    setStep("time");
    setTime("");
    setCraving("");
    setAvailable("");
    setSuggestion(null);
  }

  if (step === "time") {
    return (
      <Card>
        <CardContent className="flex flex-col gap-4 p-6">
          <p className="font-heading text-lg font-medium">Combien de temps avez-vous ?</p>
          <div className="grid grid-cols-3 gap-2">
            {TIME_OPTIONS.map((t) => (
              <Button
                key={t}
                variant="outline"
                onClick={() => {
                  setTime(t);
                  setStep("craving");
                }}
              >
                {t}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === "craving") {
    return (
      <Card>
        <CardContent className="flex flex-col gap-4 p-6">
          <p className="font-heading text-lg font-medium">Vous avez plutôt envie de quoi ?</p>
          <div className="grid grid-cols-2 gap-2">
            {CRAVING_OPTIONS.map((c) => (
              <Button
                key={c}
                variant="outline"
                onClick={() => {
                  setCraving(c);
                  setStep("available");
                }}
              >
                {c}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === "available") {
    return (
      <Card>
        <CardContent className="flex flex-col gap-4 p-6">
          <p className="font-heading text-lg font-medium">Qu&apos;avez-vous sous la main ?</p>
          <Textarea
            placeholder="Ex : des courgettes, des œufs… (facultatif)"
            value={available}
            onChange={(e) => setAvailable(e.target.value)}
            rows={3}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button size="lg" onClick={fetchSuggestion}>
            Trouver une idée
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (step === "loading") {
    return (
      <Card>
        <CardContent className="p-6 text-center text-sm text-muted-foreground">
          Recherche d&apos;une idée adaptée…
        </CardContent>
      </Card>
    );
  }

  if (!suggestion) return null;

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col gap-3 p-6">
          <div>
            <p className="font-heading text-lg font-medium">{suggestion.name}</p>
            <p className="text-sm text-muted-foreground">{suggestion.time}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Ingrédients</p>
            <ul className="mt-1 flex flex-col gap-1 text-sm text-muted-foreground">
              {suggestion.ingredients.map((ing, i) => (
                <li key={i}>• {ing}</li>
              ))}
            </ul>
          </div>
          {suggestion.steps.length > 0 && (
            <div>
              <p className="text-sm font-medium">Étapes</p>
              <ol className="mt-1 flex flex-col gap-1 text-sm text-muted-foreground">
                {suggestion.steps.map((s, i) => (
                  <li key={i}>
                    {i + 1}. {s}
                  </li>
                ))}
              </ol>
            </div>
          )}
          <p className={cn("text-sm text-muted-foreground", isTeaser && "italic")}>{suggestion.whyFits}</p>
          {!isTeaser && (
            <FavoriteButton
              recipe={{
                title: suggestion.name,
                time: suggestion.time,
                ingredients: suggestion.ingredients,
                steps: suggestion.steps,
                source: "sos",
              }}
            />
          )}
        </CardContent>
      </Card>

      {isTeaser && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
            <p className="font-medium">Débloquez la recette complète</p>
            <Button asChild size="sm">
              <Link href="/abonnement">Voir les formules</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <Button variant="outline" size="lg" onClick={reset}>
        <RotateCcw className="h-4 w-4" /> Une autre idée
      </Button>
    </div>
  );
}
