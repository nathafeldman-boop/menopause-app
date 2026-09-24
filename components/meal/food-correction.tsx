"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CONFIDENCE_DISPLAY } from "@/lib/food-confidence";
import { cn } from "@/lib/utils";
import type { DetectedFood } from "@/lib/ai/types";

const CATEGORY_LABELS: Record<string, string> = {
  protein: "Protéine",
  vegetable: "Légume",
  fruit: "Fruit",
  grain: "Féculent",
  legume: "Légumineuse",
  dairy: "Laitier",
  fat: "Matière grasse",
  sauce: "Sauce",
  herb_spice: "Herbe / épice",
  drink: "Boisson",
  sweet: "Sucré",
  other: "Autre",
};

export function FoodCorrection({ mealId, food, index }: { mealId: string; food: DetectedFood; index: number }) {
  const [current, setCurrent] = useState(food);
  const [editing, setEditing] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const [saving, setSaving] = useState(false);

  const confidence = CONFIDENCE_DISPLAY[current.confidence];

  async function submitCorrection(correctedName: string) {
    if (!correctedName.trim() || correctedName.trim() === current.name) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/meals/${mealId}/correct-food`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodIndex: index, correctedName: correctedName.trim() }),
      });
      if (res.ok) {
        setCurrent({ ...current, name: correctedName.trim(), confidence: "high", userCorrected: true });
        setEditing(false);
        setCustomValue("");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 border-b border-border py-3 last:border-0">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium capitalize">{current.name}</span>
            {current.userCorrected && (
              <span className="text-xs text-muted-foreground">(corrigé)</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {CATEGORY_LABELS[current.category] ?? current.category}
            {current.preparation && ` · ${current.preparation}`}
            {current.quantityEstimate && ` · ${current.quantityEstimate}`}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className={cn(
              "text-xs font-medium",
              current.confidence === "high" && "text-secondary",
              current.confidence === "medium" && "text-foreground",
              (current.confidence === "low" || current.confidence === "unknown") && "text-accent"
            )}
            title={confidence.label}
          >
            {confidence.icon} {confidence.label}
          </span>
          <button
            type="button"
            onClick={() => setEditing((v) => !v)}
            className="flex items-center gap-1 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            <Pencil className="h-3 w-3" /> Modifier
          </button>
        </div>
      </div>

      {current.evidence && !editing && (
        <p className="text-xs italic text-muted-foreground">{current.evidence}</p>
      )}

      {editing && (
        <div className="flex flex-col gap-2 rounded-xl bg-muted/50 p-3">
          {current.possibleAlternatives.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {current.possibleAlternatives.map((alt) => (
                <Button
                  key={alt}
                  variant="outline"
                  size="sm"
                  disabled={saving}
                  onClick={() => submitCorrection(alt)}
                >
                  {alt}
                </Button>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <Input
              placeholder="Ce n'est pas ça ? Précisez…"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
            />
            <Button size="sm" disabled={saving || !customValue.trim()} onClick={() => submitCorrection(customValue)}>
              OK
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
