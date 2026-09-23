import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { RecipeCard } from "@/components/ingredients/recipe-card";
import { LockedContent } from "@/components/billing/locked-content";
import type { GeneratedRecipe } from "@/lib/ai/types";

const FULL_RECIPE_COUNT = 3;

export const metadata: Metadata = { title: "Vos recettes" };

export default async function IngredientRecipesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: row } = await supabase
    .from("ingredient_recipes")
    .select("*")
    .eq("id", id)
    .single();

  if (!row) notFound();

  const recipes = row.recipes as unknown as GeneratedRecipe[];

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/ingredients"
        className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Retour
      </Link>
      <div>
        <h1 className="font-heading text-2xl font-medium">Vos recettes</h1>
        <p className="mt-1 text-muted-foreground">À partir de : {row.ingredients_input.join(", ")}</p>
      </div>
      <div className="flex flex-col gap-3">
        {recipes.map((recipe, i) => (
          <RecipeCard key={i} recipe={recipe} />
        ))}
        {row.is_teaser &&
          Array.from({ length: Math.max(0, FULL_RECIPE_COUNT - recipes.length) }).map((_, i) => (
            <LockedContent
              key={`locked-${i}`}
              label="Recette verrouillée"
              description="Débloquez les recettes suivantes avec votre abonnement."
              lines={2}
            />
          ))}
      </div>
    </div>
  );
}
