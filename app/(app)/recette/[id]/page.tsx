import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Sparkles, Users, Clock } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { hasActiveSubscription } from "@/lib/subscription";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScoreGauge } from "@/components/meal/score-gauge";
import { AdaptRecipeButton } from "@/components/recipe/adapt-recipe-button";
import { PaywallPrompt } from "@/components/billing/paywall-prompt";
import { getFitScoreLabel } from "@/lib/score";
import type { AdaptedIngredient } from "@/lib/ai/types";

export const metadata: Metadata = { title: "Votre recette" };

type Extracted = { ingredients?: string[]; steps?: string[]; servings?: string; time?: string };
type Adapted = {
  title?: string;
  ingredients?: AdaptedIngredient[];
  steps?: string[];
  whatChanged?: string[];
};

export default async function RecipeResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: recipe } = await supabase.from("recipe_scans").select("*").eq("id", id).single();

  if (!recipe) notFound();

  const subscribed = await hasActiveSubscription(supabase, user!.id);

  const extracted = (recipe.extracted ?? {}) as Extracted;
  const adapted = recipe.adapted as Adapted | null;
  const fitScore = recipe.fit_score ?? 0;

  const signedUrl = recipe.image_path
    ? (await supabase.storage.from("photos").createSignedUrl(recipe.image_path, 3600)).data
        ?.signedUrl
    : null;

  const meta = [extracted.servings, extracted.time].filter(Boolean);

  const originalView = (
    <div className="flex flex-col gap-6">
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

      {!adapted &&
        (subscribed ? (
          <AdaptRecipeButton recipeId={recipe.id} />
        ) : (
          <PaywallPrompt
            title="Adaptez cette recette"
            description="L'adaptation de recette fait partie de votre accompagnement Alma."
          />
        ))}
    </div>
  );

  const adaptedView = adapted ? (
    <div className="flex flex-col gap-6">
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex items-center gap-4 p-5">
          <ScoreGauge score={fitScore} />
          <div>
            <p className="font-heading text-lg font-medium leading-tight">
              {getFitScoreLabel(fitScore)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Version originale : {fitScore}/100
            </p>
          </div>
        </CardContent>
      </Card>

      {adapted.whatChanged && adapted.whatChanged.length > 0 && (
        <Card>
          <CardContent className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-lg font-medium">Ce qui change</h2>
            </div>
            <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">
              {adapted.whatChanged.map((c, i) => (
                <li key={i}>→ {c}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-5">
          <h2 className="mb-3 font-heading text-lg font-medium">
            {adapted.title ?? "Version adaptée"}
          </h2>

          <h3 className="mb-1.5 text-sm font-medium">Ingrédients</h3>
          <ul className="mb-4 flex flex-col gap-1 text-sm">
            {(adapted.ingredients ?? []).map((ing, i) => (
              <li key={i} className={ing.isNew || ing.note ? "text-primary" : undefined}>
                • {ing.text}
                {ing.isNew && <span className="text-primary"> (nouveau)</span>}
                {ing.note && <span className="text-muted-foreground"> ({ing.note})</span>}
              </li>
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
    </div>
  ) : null;

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/dashboard"
        className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Retour
      </Link>

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
        {meta.length > 0 && (
          <div className="mt-1.5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {extracted.servings && (
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" /> {extracted.servings}
              </span>
            )}
            {extracted.time && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> {extracted.time}
              </span>
            )}
          </div>
        )}
        {recipe.summary && <p className="mt-2 text-muted-foreground">{recipe.summary}</p>}
      </div>

      {adapted ? (
        <Tabs defaultValue="adaptee">
          <TabsList>
            <TabsTrigger value="originale">Originale</TabsTrigger>
            <TabsTrigger value="adaptee">Adaptée</TabsTrigger>
          </TabsList>
          <TabsContent value="originale">
            <div className="flex flex-col gap-6">
              <Card>
                <CardContent className="flex items-center gap-4 p-5">
                  <ScoreGauge score={fitScore} />
                  <div>
                    <p className="font-heading text-lg font-medium leading-tight">
                      {getFitScoreLabel(fitScore)}
                    </p>
                  </div>
                </CardContent>
              </Card>
              {originalView}
            </div>
          </TabsContent>
          <TabsContent value="adaptee">{adaptedView}</TabsContent>
        </Tabs>
      ) : (
        <div className="flex flex-col gap-6">
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <ScoreGauge score={fitScore} />
              <div>
                <p className="font-heading text-lg font-medium leading-tight">
                  {getFitScoreLabel(fitScore)}
                </p>
              </div>
            </CardContent>
          </Card>
          {originalView}
        </div>
      )}
    </div>
  );
}
