"use client";

import { useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PhotoPicker } from "@/components/photo/photo-picker";

export function IngredientsForm({ subscribed }: { subscribed: boolean }) {
  const router = useRouter();
  const [chips, setChips] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [photo, setPhoto] = useState<Blob | null>(null);
  const [isLeftovers, setIsLeftovers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    const formData = new FormData();
    if (finalChips.length > 0) formData.append("ingredients", JSON.stringify(finalChips));
    if (photo) formData.append("photo", photo, "ingredients.jpg");
    if (isLeftovers) formData.append("isLeftovers", "true");

    try {
      const res = await fetch("/api/recipes/from-ingredients", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        if (data.error === "no_ingredients_detected") {
          setError(
            "Nous n'avons pas identifié d'ingrédients sur cette photo. Réessayez avec une photo nette de vos aliments."
          );
        } else {
          setError("Une erreur est survenue. Merci de réessayer.");
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
                  <Badge key={i} variant="default" className="pr-1.5">
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

      <label className="flex items-center gap-2 text-sm">
        <Checkbox checked={isLeftovers} onChange={(e) => setIsLeftovers(e.target.checked)} />
        Ce sont des restes déjà cuisinés (ex : poulet d&apos;hier)
      </label>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button size="lg" onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting
          ? "Recherche de recettes…"
          : subscribed
            ? "Trouver 3 recettes"
            : "Trouver une recette"}
      </Button>
    </div>
  );
}
