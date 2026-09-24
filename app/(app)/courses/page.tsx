import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { generateWeeklyPlanForUser } from "@/lib/meal-plan";
import { ShoppingListView } from "@/components/shopping-list/shopping-list-view";
import { PaywallPrompt } from "@/components/billing/paywall-prompt";
import { APP_NAME } from "@/lib/brand";
import type { ShoppingListItem } from "@/lib/ai/types";

export const metadata: Metadata = { title: "Ma liste de courses" };

export default async function CoursesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: existing } = await supabase
    .from("meal_plans")
    .select("shopping_list, is_teaser")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const plan = existing ?? (await generateWeeklyPlanForUser(supabase, user!.id));
  const items = (plan.shopping_list ?? []) as unknown as ShoppingListItem[];

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/plan"
        className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Retour
      </Link>
      <div>
        <h1 className="font-heading text-2xl font-medium">Ma liste de courses</h1>
        <p className="mt-1 text-muted-foreground">
          Générée automatiquement à partir de votre plan de la semaine.
        </p>
      </div>

      <ShoppingListView items={items} />

      {plan.is_teaser && (
        <PaywallPrompt
          title="Débloquez la liste complète"
          description={`Les ingrédients des 7 jours font partie de votre accompagnement ${APP_NAME}.`}
        />
      )}
    </div>
  );
}
