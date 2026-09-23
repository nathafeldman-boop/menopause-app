"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { GeneratedRecipe } from "@/lib/ai/types";

export function RecipeCard({ recipe }: { recipe: GeneratedRecipe }) {
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <button type="button" onClick={() => setOpen((o) => !o)} className="w-full text-left">
        <CardContent className="flex items-center justify-between gap-3 p-5">
          <div>
            <p className="font-heading text-lg font-medium">{recipe.name}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{recipe.time}</p>
            <p className="mt-1 text-sm">{recipe.whyFits}</p>
          </div>
          <ChevronDown
            className={cn(
              "h-5 w-5 shrink-0 text-muted-foreground transition-transform",
              open && "rotate-180"
            )}
          />
        </CardContent>
      </button>
      {open && (
        <CardContent className="border-t border-border p-5 pt-4">
          <h3 className="mb-1.5 text-sm font-medium">Ingrédients</h3>
          <ul className="mb-4 flex flex-col gap-1 text-sm">
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>• {ing}</li>
            ))}
          </ul>
          <h3 className="mb-1.5 text-sm font-medium">Étapes</h3>
          <ol className="flex flex-col gap-2 text-sm">
            {recipe.steps.map((step, i) => (
              <li key={i} className="flex gap-2">
                <span className="font-medium text-primary">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      )}
    </Card>
  );
}
