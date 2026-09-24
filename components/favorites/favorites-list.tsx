"use client";

import { useState } from "react";
import { Trash2, Clock, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type Favorite = {
  id: string;
  title: string;
  time: string | null;
  servings: string | null;
  ingredients: string[];
  steps: string[];
  source: string;
};

const SOURCE_LABELS: Record<string, string> = {
  recipe_scan: "Recette scannée",
  ingredients: "Recette ingrédients",
  sos: "SOS repas",
  meal_plan: "Plan de la semaine",
  other: "Autre",
};

export function FavoritesList({ favorites: initial }: { favorites: Favorite[] }) {
  const [favorites, setFavorites] = useState(initial);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function remove(id: string) {
    setDeleting(id);
    setFavorites((prev) => prev.filter((f) => f.id !== id));
    try {
      await fetch("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } finally {
      setDeleting(null);
    }
  }

  if (favorites.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-sm text-muted-foreground">
          Aucune recette sauvegardée pour le moment. Ajoutez-en depuis une recette, une idée SOS ou une
          suggestion à partir de vos ingrédients.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {favorites.map((fav) => (
        <Card key={fav.id}>
          <CardContent className="p-5">
            <div className="mb-2 flex items-start justify-between gap-3">
              <div>
                <p className="font-heading text-lg font-medium leading-snug">{fav.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  {fav.servings && (
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" /> {fav.servings}
                    </span>
                  )}
                  {fav.time && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {fav.time}
                    </span>
                  )}
                  <Badge>{SOURCE_LABELS[fav.source] ?? "Autre"}</Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                disabled={deleting === fav.id}
                onClick={() => remove(fav.id)}
                className="shrink-0 text-muted-foreground"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {fav.ingredients.length > 0 && (
              <>
                <h3 className="mb-1.5 text-sm font-medium">Ingrédients</h3>
                <ul className="mb-3 flex flex-col gap-1 text-sm">
                  {fav.ingredients.map((ing, i) => (
                    <li key={i}>• {ing}</li>
                  ))}
                </ul>
              </>
            )}

            {fav.steps.length > 0 && (
              <>
                <h3 className="mb-1.5 text-sm font-medium">Étapes</h3>
                <ol className="flex flex-col gap-2 text-sm">
                  {fav.steps.map((step, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="font-medium text-primary">{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
