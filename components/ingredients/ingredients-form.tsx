"use client";

import { useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PhotoPicker } from "@/components/photo/photo-picker";

export function IngredientsForm() {
  const router = useRouter();
  const [chips, setChips] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [photo, setPhoto] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insufficientCredits, setInsufficientCredits] = useState(false);

  function commitChipsFromInput() {
    const parts = inputValue
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length > 0) {
      setChips((prev) => [...prev, ...parts]);
      setInputValue("");
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commitChipsFromInput();
    }
  }

  function removeChip(index: number) {
    setChips((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    const finalChips = [
      ...chips,
      ...inputValue
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    ];

    if (finalChips.length === 0 && !photo) {
      setError("Ajoutez au moins un ingrédient, ou photographiez-les.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setInsufficientCredits(false);

    const formData = new FormData();
    if (finalChips.length > 0) formData.append("ingredients", JSON.stringify(finalChips));
    if (photo) formData.append("photo", photo, "ingredients.jpg");

    try {
      const res = await fetch("/api/recipes/from-ingredients", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        if (data.error === "insufficient_credits") {
          setInsufficientCredits(true);
        } else {
          setError(data.error || "Une erreur est survenue. Merci de réessayer.");
        }
        setIsSubmitting(false);
        return;
      }

      router.push(`/ingredients/${data.id}`);
    } catch {
      setError("Une erreur est survenue. Vérifiez votre connexion.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Tabs defaultValue="text">
        <TabsList>
          <TabsTrigger value="text">Écrire</TabsTrigger>
          <TabsTrigger value="photo">Photographier</TabsTrigger>
        </TabsList>

        <TabsContent value="text">
          <div className="flex flex-col gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={commitChipsFromInput}
              placeholder="Ex : poulet, courgettes, œufs, riz, feta"
            />
            {chips.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {chips.map((chip, i) => (
                  <Badge key={i} variant="primary" className="pr-1.5">
                    {chip}
                    <button type="button" onClick={() => removeChip(i)} aria-label={`Retirer ${chip}`}>
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Séparez les ingrédients par une virgule ou appuyez sur Entrée.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="photo">
          <PhotoPicker
            label="Photographier mes ingrédients"
            helper="Frigo, placard, plan de travail…"
            onReady={(blob) => setPhoto(blob)}
            onClear={() => setPhoto(null)}
          />
        </TabsContent>
      </Tabs>

      {insufficientCredits && (
        <div className="rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm">
          <p className="font-medium">Vous n&apos;avez plus assez de crédits.</p>
          <p className="mt-1 text-muted-foreground">
            <Link href="/abonnement" className="text-primary underline underline-offset-4">
              Voir les options
            </Link>{" "}
            pour continuer votre accompagnement.
          </p>
        </div>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button size="lg" onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Recherche de recettes…" : "Trouver 3 recettes (5 crédits)"}
      </Button>
    </div>
  );
}
