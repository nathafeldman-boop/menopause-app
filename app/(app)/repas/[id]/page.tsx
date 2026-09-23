import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";
import { ScoreGauge } from "@/components/meal/score-gauge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FLAG_LABELS, LEVEL_LABELS } from "@/lib/meal-labels";

export const metadata: Metadata = { title: "Analyse de votre repas" };

export default async function MealResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: meal } = await supabase.from("meal_analyses").select("*").eq("id", id).single();

  if (!meal) notFound();

  const { data: signed } = await supabase.storage
    .from("photos")
    .createSignedUrl(meal.image_path, 3600);

  return (
    <div className="flex flex-col gap-6">
      {signed?.signedUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={signed.signedUrl}
          alt={meal.meal_name ?? "Votre repas"}
          className="max-h-80 w-full rounded-2xl border border-border object-cover"
        />
      )}

      <div>
        {meal.meal_name && <p className="text-sm text-muted-foreground">{meal.meal_name}</p>}
        <ScoreGauge score={meal.score ?? 0} />
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <InfoChip label="Protéines" value={FLAG_LABELS[meal.protein_flag ?? "unclear"]} />
        <InfoChip label="Végétaux / fibres" value={FLAG_LABELS[meal.veg_fiber_flag ?? "unclear"]} />
        <InfoChip label="Calcium" value={FLAG_LABELS[meal.calcium_flag ?? "unclear"]} />
        <InfoChip label="Glucides" value={LEVEL_LABELS[meal.carbs_level ?? "unclear"]} />
        <InfoChip label="Mat. grasses" value={LEVEL_LABELS[meal.fat_level ?? "unclear"]} />
        <InfoChip label="Sucres visibles" value={FLAG_LABELS[meal.sugar_flag ?? "unclear"]} />
      </div>

      {meal.good_points.length > 0 && (
        <Card>
          <CardContent className="p-5">
            <h2 className="mb-3 font-heading text-lg font-medium">Ce qui est déjà bien</h2>
            <ul className="flex flex-col gap-2 text-sm">
              {meal.good_points.map((point, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1 text-secondary">●</span>
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
                  <span className="mt-1 text-accent">●</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {meal.suggestions.length > 0 && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-5">
            <h2 className="mb-3 font-heading text-lg font-medium">Notre suggestion</h2>
            <ul className="flex flex-col gap-2 text-sm">
              {meal.suggestions.map((point, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1 text-primary">→</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
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

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-2">
      <p className="text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-medium text-foreground">{value}</p>
    </div>
  );
}
