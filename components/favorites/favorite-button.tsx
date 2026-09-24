"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FavoritePayload = {
  title: string;
  time?: string;
  servings?: string;
  ingredients: string[];
  steps: string[];
  source: "recipe_scan" | "ingredients" | "sos" | "meal_plan";
};

export function FavoriteButton({ recipe }: { recipe: FavoritePayload }) {
  const [savedId, setSavedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      if (savedId) {
        await fetch("/api/favorites", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: savedId }),
        });
        setSavedId(null);
      } else {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(recipe),
        });
        if (res.ok) {
          const data = await res.json();
          setSavedId(data.id);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={toggle} disabled={loading}>
      <Heart className={cn("h-4 w-4", savedId && "fill-primary text-primary")} />
      {savedId ? "Enregistrée" : "Sauvegarder"}
    </Button>
  );
}
