import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  Camera,
  ChefHat,
  Refrigerator,
  MessageCircle,
  ChevronRight,
  CalendarDays,
  ShoppingCart,
  LifeBuoy,
  Heart,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/profile";
import { getTodayProgress, todayWeekdayName } from "@/lib/daily-progress";
import { GOAL_LABELS } from "@/lib/labels";
import { TodayPlanCard } from "@/components/dashboard/today-plan-card";
import { CheckInCard } from "@/components/dashboard/checkin-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { DayPlan } from "@/lib/ai/types";

export const metadata: Metadata = { title: "Accueil" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [{ count: mealsThisWeek }, profile, todayProgress, { data: plan }] = await Promise.all([
    supabase
      .from("meal_analyses")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user!.id)
      .gte("created_at", weekAgo.toISOString()),
    getProfile(supabase, user!.id),
    getTodayProgress(supabase, user!.id),
    supabase
      .from("meal_plans")
      .select("days")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const days = (plan?.days ?? []) as unknown as DayPlan[];
  const todayMeals = days.find((d) => d.day === todayWeekdayName())?.meals ?? [];
  const goalLabel = profile?.goal ? GOAL_LABELS[profile.goal] ?? profile.goal : null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-medium">Bonjour</h1>
        <p className="mt-1 text-muted-foreground">
          Qu&apos;aimeriez-vous faire aujourd&apos;hui&nbsp;?
        </p>
      </div>

      <TodayPlanCard meals={todayMeals} initialDone={todayProgress.meals_done} goalLabel={goalLabel} />

      <Link href="/sos">
        <Card className="border-primary/30 bg-primary/5 transition-colors hover:bg-primary/10">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
              <LifeBuoy className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium">SOS, je ne sais pas quoi manger</p>
              <p className="text-sm text-muted-foreground">Une idée en 3 questions</p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
          </CardContent>
        </Card>
      </Link>

      <CheckInCard alreadyDone={!!todayProgress.mood} />

      <Card>
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border">
            <Image
              src="/images/healthy-bowl.jpg"
              alt="Assiette colorée et équilibrée"
              fill
              sizes="(min-width: 768px) 28rem, 90vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-heading text-lg font-medium">Photographiez votre repas</p>
            <p className="text-sm text-muted-foreground">
              Une analyse claire et des conseils concrets, en quelques secondes.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/repas/nouveau">
              <Camera className="h-5 w-5" /> Photographier mon repas
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Link href="/recette/scanner">
          <Card className="h-full transition-colors hover:bg-muted/60">
            <CardContent className="flex flex-col gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/15 text-secondary">
                <ChefHat className="h-5 w-5" />
              </div>
              <p className="font-medium leading-snug">Scanner une recette</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/ingredients">
          <Card className="h-full transition-colors hover:bg-muted/60">
            <CardContent className="flex flex-col gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/15 text-secondary">
                <Refrigerator className="h-5 w-5" />
              </div>
              <p className="font-medium leading-snug">Recettes avec mes ingrédients</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/plan">
          <Card className="h-full transition-colors hover:bg-muted/60">
            <CardContent className="flex flex-col gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/15 text-secondary">
                <CalendarDays className="h-5 w-5" />
              </div>
              <p className="font-medium leading-snug">Mon plan de la semaine</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/courses">
          <Card className="h-full transition-colors hover:bg-muted/60">
            <CardContent className="flex flex-col gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/15 text-secondary">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <p className="font-medium leading-snug">Liste de courses</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/favoris">
          <Card className="h-full transition-colors hover:bg-muted/60">
            <CardContent className="flex flex-col gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/15 text-secondary">
                <Heart className="h-5 w-5" />
              </div>
              <p className="font-medium leading-snug">Mes favoris</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Link href="/coach">
        <Card className="transition-colors hover:bg-muted/60">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-secondary">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Parler à mon coach</p>
              <p className="text-sm text-muted-foreground">Une question ? Une idée de repas ?</p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
          </CardContent>
        </Card>
      </Link>

      <Card>
        <CardContent className="flex flex-col gap-3 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Cette semaine</p>
              <p className="font-heading text-xl font-medium">
                {mealsThisWeek ?? 0} repas analysé{(mealsThisWeek ?? 0) > 1 ? "s" : ""}
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/resume">Voir mon résumé</Link>
            </Button>
          </div>
          <Link href="/repas" className="text-xs text-muted-foreground underline underline-offset-4">
            Voir l&apos;historique complet
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
