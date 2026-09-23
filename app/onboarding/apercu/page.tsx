import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";
import { hasActiveSubscription } from "@/lib/subscription";
import { generateWeeklyPlanForUser } from "@/lib/meal-plan";
import { MealPlanView } from "@/components/meal-plan/meal-plan-view";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/billing";
import type { DayPlan } from "@/lib/ai/types";

export const metadata: Metadata = { title: "Votre programme" };

export default async function OnboardingApercuPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const subscribed = await hasActiveSubscription(supabase, user.id);

  const { data: existing } = await supabase
    .from("meal_plans")
    .select("days, is_teaser")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const plan = existing ?? (await generateWeeklyPlanForUser(supabase, user.id));
  const days = plan.days as unknown as DayPlan[];

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col gap-6 px-5 py-8">
      <div>
        <h1 className="font-heading text-2xl font-medium leading-snug">
          Voici un premier aperçu de votre programme
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Construit à partir de vos réponses, pour vous accompagner au quotidien.
        </p>
      </div>

      <MealPlanView days={days} isTeaser={plan.is_teaser} />

      {plan.is_teaser && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex flex-col gap-3 p-6 text-center">
            <p className="font-heading text-lg font-medium">Débloquez votre programme complet</p>
            <p className="text-sm text-muted-foreground">
              Les 7 jours de la semaine, l&apos;analyse de vos repas en photo, l&apos;adaptation de
              vos recettes et votre coach personnel.
            </p>
            <Button asChild size="lg" className="mt-1">
              <Link href="/abonnement">
                Débloquer mon programme · {PLANS.monthly.price}
                {PLANS.monthly.period}
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <Button asChild variant={subscribed ? "primary" : "ghost"} size="lg">
        <Link href="/dashboard">Continuer vers l&apos;application</Link>
      </Button>
    </div>
  );
}
