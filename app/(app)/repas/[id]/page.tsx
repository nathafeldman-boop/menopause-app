import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Check, TriangleAlert } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { ScoreGauge } from "@/components/meal/score-gauge";
import { FoodCorrection } from "@/components/meal/food-correction";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FLAG_LABELS, LEVEL_LABELS, getMealTimeLabel, formatMealTime } from "@/lib/meal-labels";
import { getScoreLabel, getScoreSummary } from "@/lib/score";
import type { MealAnalysisResult } from "@/lib/ai/types";

export const metadata: Metadata = { title: "Analyse de votre repas" };

export default async function MealResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: meal } = await supabase.from("meal_analyses").select("*").eq("id", id).single();

  if (!meal) notFound();

  const { data: signed } = await supabase.storage
    .from("photos")
    .createSignedUrl(meal.image_path, 3600);

  const score = meal.score ?? 0;
  const analysis = meal.raw_ai as unknown as MealAnalysisResult | null;
  // Discriminant simple entre une ancienne analyse (avant l'enrichissement de la reconnaissance)
  // et une nouvelle : seules les nouvelles portent un tableau `foods`. Garantit que les repas déjà
  // analysés avant cette évolution continuent de s'afficher normalement (rendu "historique" ci-dessous).
  const hasRichAnalysis = !!analysis?.foods;

  const chips: Array<{ label: string; value: string; tone: "good" | "warn" | "neutral" }> = [
    {
      label: "Protéines",
      value: FLAG_LABELS[meal.protein_flag ?? "unclear"],
      tone: meal.protein_flag === "present" ? "good" : "neutral",
    },
    {
      label: "Végétaux / fibres",
      value: FLAG_LABELS[meal.veg_fiber_flag ?? "unclear"],
      tone: meal.veg_fiber_flag === "present" ? "good" : "neutral",
    },
    {
      label: "Calcium",
      value: FLAG_LABELS[meal.calcium_flag ?? "unclear"],
      tone: meal.calcium_flag === "present" ? "good" : "warn",
    },
    {
      label: "Glucides",
      value: LEVEL_LABELS[meal.carbs_level ?? "unclear"],
      tone: "neutral",
    },
    {
      label: "Mat. grasses",
      value: LEVEL_LABELS[meal.fat_level ?? "unclear"],
      tone: "neutral",
    },
    {
      label: "Sucres visibles",
      value: FLAG_LABELS[meal.sugar_flag ?? "unclear"],
      tone: meal.sugar_flag === "absent" ? "good" : "warn",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/repas"
        className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Votre repas
      </Link>

      {signed?.signedUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={signed.signedUrl}
          alt={meal.meal_name ?? "Votre repas"}
          className="max-h-80 w-full rounded-2xl border border-border object-cover"
        />
      )}

      <div>
        <p className="text-sm text-muted-foreground">
          {getMealTimeLabel(meal.created_at)} · {formatMealTime(meal.created_at)}
        </p>
        {meal.meal_name && (
          <h1 className="mt-0.5 font-heading text-2xl font-medium">{meal.meal_name}</h1>
        )}
      </div>

      <Card>
        <CardContent className="flex items-center gap-4 p-5">
          <ScoreGauge score={score} />
          <div>
            <p className="font-heading text-lg font-medium leading-tight">
              {getScoreLabel(score)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {hasRichAnalysis && analysis!.summary ? analysis!.summary : getScoreSummary(score)}
            </p>
          </div>
        </CardContent>
      </Card>

      {hasRichAnalysis && analysis!.imageIssue && (
        <Card className="border-accent/40 bg-accent/5">
          <CardContent className="flex items-start gap-3 p-4">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <p className="text-sm text-muted-foreground">
              {analysis!.imageIssue}. La reconnaissance ci-dessous peut être moins fiable que
              d&apos;habitude — n&apos;hésitez pas à corriger ce qui ne correspond pas.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <Badge
            key={chip.label}
            variant={chip.tone === "good" ? "success" : chip.tone === "warn" ? "warning" : "default"}
          >
            {chip.label} : {chip.value}
          </Badge>
        ))}
      </div>

      {hasRichAnalysis ? (
        <>
          {analysis!.foods.length > 0 && (
            <Card>
              <CardContent className="p-5">
                <h2 className="mb-1 font-heading text-lg font-medium">J&apos;ai reconnu</h2>
                <p className="mb-3 text-xs text-muted-foreground">
                  Une erreur ? Corrigez directement un aliment ci-dessous.
                </p>
                <div className="flex flex-col">
                  {analysis!.foods.map((food, i) => (
                    <FoodCorrection key={i} mealId={meal.id} food={food} index={i} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {analysis!.positives.length > 0 && (
            <Card>
              <CardContent className="p-5">
                <h2 className="mb-3 font-heading text-lg font-medium">Ce qui est bien</h2>
                <ul className="flex flex-col gap-3 text-sm">
                  {analysis!.positives.map((p, i) => (
                    <li key={i} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                      <span>
                        <span className="font-medium">{p.title}.</span> {p.explanation}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {analysis!.improvements.length > 0 && (
            <Card>
              <CardContent className="p-5">
                <h2 className="mb-3 font-heading text-lg font-medium">À améliorer</h2>
                <ul className="flex flex-col gap-3 text-sm">
                  {analysis!.improvements.map((imp, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>
                        <span className="font-medium">{imp.title}.</span> {imp.explanation}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {analysis!.improvedVersion && (
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-5">
                <h2 className="mb-2 font-heading text-lg font-medium">✨ Ma version</h2>
                <p className="text-sm text-muted-foreground">{analysis!.improvedVersion}</p>
              </CardContent>
            </Card>
          )}

          {analysis!.personalizedTip && (
            <Card className="border-none bg-muted">
              <CardContent className="p-5">
                <h2 className="mb-2 font-heading text-lg font-medium">💡 Pour la prochaine fois</h2>
                <p className="text-sm">{analysis!.personalizedTip}</p>
              </CardContent>
            </Card>
          )}

          {analysis!.nextActionLabel && (
            <p className="text-center text-sm text-muted-foreground">{analysis!.nextActionLabel}</p>
          )}
        </>
      ) : (
        <>
          {meal.good_points.length > 0 && (
            <Card>
              <CardContent className="p-5">
                <h2 className="mb-3 font-heading text-lg font-medium">Ce qui est déjà bien</h2>
                <ul className="flex flex-col gap-2 text-sm">
                  {meal.good_points.map((point, i) => (
                    <li key={i} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {meal.improve_points.length > 0 && (
            <Card>
              <CardContent className="p-5">
                <h2 className="mb-3 font-heading text-lg font-medium">Ce que vous pourriez améliorer</h2>
                <ul className="flex flex-col gap-2 text-sm">
                  {meal.improve_points.map((point, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {meal.suggestions.length > 0 && (
            <Card className="border-none bg-muted">
              <CardContent className="p-5">
                <h2 className="mb-3 font-heading text-lg font-medium">Notre suggestion</h2>
                <ul className="flex flex-col gap-3 text-sm">
                  {meal.suggestions.map((point, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                        {i + 1}
                      </span>
                      <span className="pt-0.5">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Cette analyse est une aide générale et ne remplace pas l&apos;avis d&apos;un professionnel
        de santé.
      </p>

      <Button asChild variant="outline">
        <Link href="/repas/nouveau">Analyser un autre repas</Link>
      </Button>
    </div>
  );
}
