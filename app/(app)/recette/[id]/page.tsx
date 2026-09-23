import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Sparkles } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { ScoreGauge } from "@/components/meal/score-gauge";
import { AdaptRecipeButton } from "@/components/recipe/adapt-recipe-button";

export const metadata: Metadata = { title: "Votre recette" };

type Extracted = { ingredients?: string[]; steps?: string[] };
type Adapted = { title?: string; ingredients?: string[]; steps?: string[]; whatChanged?: string[] };

export default async function RecipeResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: recipe } = await supabase.from("recipe_scans").select("*").eq("id", id).single();

  if (!recipe) notFound();

  const extracted = (recipe.extracted ?? {}) as Extracted;
  const adapted = recipe.adapted as Adapted | null;

  const signedUrl = recipe.image_path
    ? (await supabase.storage.from("photos").createSignedUrl(recipe.image_path, 3600)).data
        ?.signedUrl
    : null;

  return (
    <div className="flex flex-col gap-6">
      {signedUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={signedUrl}
          alt={recipe.title ?? "Recette"}
          className="max-h-72 w-full rounded-2xl border border-border object-cover"
        />
      )}

      <div>
        <h1 className="font-heading text-2xl font-medium">{recipe.title}</h1>
        {recipe.summary && <p className="mt-1 text-muted-foreground">{recipe.summary}</p>}
      </div>

      <ScoreGauge score={recipe.fit_score ?? 0} label="Adéquation avec votre profil" />

      {recipe.good_points.length > 0 && (
        <Card>
          <CardContent className="p-5">
            <h2 className="mb-3 font-heading text-lg font-medium">Points positifs</h2>
            <ul className="flex flex-col gap-2 text-sm">
              {recipe.good_points.map((p, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1 text-secondary">●</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {recipe.improve_points.length > 0 && (
        <Card>
          <CardContent className="p-5">
            <h2 className="mb-3 font-heading text-lg font-medium">À améliorer</h2>
            <ul className="flex flex-col gap-2 text-sm">
              {recipe.improve_points.map((p, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1 text-accent">●</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-5">
          <h2 className="mb-3 font-heading text-lg font-medium">Ingrédients</h2>
          <ul className="flex flex-col gap-1.5 text-sm">
            {(extracted.ingredients ?? []).map((ing, i) => (
              <li key={i}>• {ing}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <h2 className="mb-3 font-heading text-lg font-medium">Étapes</h2>
          <ol className="flex flex-col gap-2 text-sm">
            {(extracted.steps ?? []).map((step, i) => (
              <li key={i} className="flex gap-2">
                <span className="font-medium text-primary">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {!adapted ? (
        <AdaptRecipeButton recipeId={recipe.id} />
      ) : (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-lg font-medium">{adapted.title ?? "Version adaptée"}</h2>
            </div>

            {adapted.whatChanged && adapted.whatChanged.length > 0 && (
              <ul className="mb-4 flex flex-col gap-1.5 text-sm text-muted-foreground">
                {adapted.whatChanged.map((c, i) => (
                  <li key={i}>→ {c}</li>
                ))}
              </ul>
            )}

            <h3 className="mb-1.5 text-sm font-medium">Ingrédients</h3>
            <ul className="mb-4 flex flex-col gap-1 text-sm">
              {(adapted.ingredients ?? []).map((ing, i) => (
                <li key={i}>• {ing}</li>
              ))}
            </ul>

            <h3 className="mb-1.5 text-sm font-medium">Étapes</h3>
            <ol className="flex flex-col gap-2 text-sm">
              {(adapted.steps ?? []).map((step, i) => (
                <li key={i} className="flex gap-2">
                  <span className="font-medium text-primary">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
