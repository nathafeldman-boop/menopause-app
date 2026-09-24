import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ShoppingCart } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { hasActiveSubscription } from "@/lib/subscription";
import { generateWeeklyPlanForUser } from "@/lib/meal-plan";
import { MealPlanView } from "@/components/meal-plan/meal-plan-view";
import { RegeneratePlanButton } from "@/components/meal-plan/regenerate-plan-button";
import { PaywallPrompt } from "@/components/billing/paywall-prompt";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/brand";
import type { DayPlan } from "@/lib/ai/types";

export const metadata: Metadata = { title: "Mon plan de la semaine" };

export default async function PlanPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [subscribed, { data: existing }] = await Promise.all([
    hasActiveSubscription(supabase, user!.id),
    supabase
      .from("meal_plans")
      .select("days, is_teaser")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const plan = existing ?? (await generateWeeklyPlanForUser(supabase, user!.id));
  const days = plan.days as unknown as DayPlan[];

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/dashboard"
        className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Retour
      </Link>
      <div>
        <h1 className="font-heading text-2xl font-medium">Mon plan de la semaine</h1>
        <p className="mt-1 text-muted-foreground">
          Un menu simple pour vos petits-déjeuners, déjeuners et dîners.
        </p>
      </div>

      <Button asChild variant="outline" size="lg">
        <Link href="/courses">
          <ShoppingCart className="h-5 w-5" /> Voir ma liste de courses
        </Link>
      </Button>

      <MealPlanView days={days} isTeaser={plan.is_teaser} />

      {plan.is_teaser &&
        (subscribed ? (
          <RegeneratePlanButton />
        ) : (
          <PaywallPrompt
            title="Débloquez votre programme complet"
            description={`Les 7 jours de la semaine font partie de votre accompagnement ${APP_NAME}.`}
          />
        ))}
    </div>
  );
}
