import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Camera, ChefHat, Smile, CalendarDays } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { startOfWeekParisIso, startOfWeekDateStringParis } from "@/lib/timezone";

export const metadata: Metadata = { title: "Ta semaine en résumé" };

export default async function ResumePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const startOfWeekIso = startOfWeekParisIso();
  const startOfWeekDate = startOfWeekDateStringParis();

  const [{ count: mealsCount }, { count: recipeScansCount }, { count: ingredientRecipesCount }, { data: progress }] =
    await Promise.all([
      supabase
        .from("meal_analyses")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user!.id)
        .gte("created_at", startOfWeekIso),
      supabase
        .from("recipe_scans")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user!.id)
        .gte("created_at", startOfWeekIso),
      supabase
        .from("ingredient_recipes")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user!.id)
        .gte("created_at", startOfWeekIso),
      supabase
        .from("daily_progress")
        .select("mood")
        .eq("user_id", user!.id)
        .gte("progress_date", startOfWeekDate),
    ]);

  const recipesCount = (recipeScansCount ?? 0) + (ingredientRecipesCount ?? 0);
  const checkins = progress ?? [];
  const goodMoods = checkins.filter((c) => c.mood === "great" || c.mood === "good").length;
  const hardMoods = checkins.filter((c) => c.mood === "hard").length;

  const hasAnyActivity = (mealsCount ?? 0) > 0 || recipesCount > 0 || checkins.length > 0;

  let highlight: string;
  if (!hasAnyActivity) {
    highlight = "Vous n'avez pas encore d'activité cette semaine — c'est le bon moment pour commencer.";
  } else if (goodMoods > hardMoods) {
    highlight = "Vos journées se sont plutôt bien passées cette semaine, continuez comme ça.";
  } else if ((mealsCount ?? 0) > 0 || recipesCount > 0) {
    highlight = "Vous avez utilisé l'application régulièrement cette semaine, c'est le plus important.";
  } else {
    highlight = "Chaque petit pas compte — reprenez à votre rythme.";
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/dashboard"
        className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Retour
      </Link>

      <div>
        <h1 className="font-heading text-2xl font-medium">Ta semaine en résumé 🌿</h1>
        <p className="mt-1 text-muted-foreground">Depuis lundi.</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="flex flex-col items-center gap-1 p-4 text-center">
            <Camera className="h-5 w-5 text-primary" />
            <span className="font-heading text-xl font-medium">{mealsCount ?? 0}</span>
            <span className="text-xs text-muted-foreground">repas analysés</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center gap-1 p-4 text-center">
            <ChefHat className="h-5 w-5 text-primary" />
            <span className="font-heading text-xl font-medium">{recipesCount}</span>
            <span className="text-xs text-muted-foreground">recettes essayées</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center gap-1 p-4 text-center">
            <Smile className="h-5 w-5 text-primary" />
            <span className="font-heading text-xl font-medium">{checkins.length}</span>
            <span className="text-xs text-muted-foreground">check-ins</span>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-5">
          <h2 className="mb-1 font-heading text-lg font-medium">Ce qui a marqué la semaine</h2>
          <p className="text-sm text-muted-foreground">{highlight}</p>
        </CardContent>
      </Card>

      <Button asChild size="lg">
        <Link href="/plan">
          <CalendarDays className="h-5 w-5" /> Créer mon prochain menu
        </Link>
      </Button>
    </div>
  );
}
