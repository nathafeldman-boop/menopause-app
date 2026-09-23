import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";
import { RecipeCard } from "@/components/ingredients/recipe-card";
import type { GeneratedRecipe } from "@/lib/ai/types";

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
      <div>
        <h1 className="font-heading text-2xl font-medium">Vos recettes</h1>
        <p className="mt-1 text-muted-foreground">À partir de : {row.ingredients_input.join(", ")}</p>
      </div>
      <div className="flex flex-col gap-3">
        {recipes.map((recipe, i) => (
          <RecipeCard key={i} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
