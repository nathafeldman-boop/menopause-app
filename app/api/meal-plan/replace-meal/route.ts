import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { getProfile, toAiContext } from "@/lib/profile";
import { hasActiveSubscription } from "@/lib/subscription";
import { buildShoppingList } from "@/lib/meal-plan";
import { ai } from "@/lib/ai";
import type { DayPlan } from "@/lib/ai/types";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!(await hasActiveSubscription(supabase, user.id))) {
    return NextResponse.json({ error: "subscription_required" }, { status: 402 });
  }

  const body = await request.json().catch(() => null);
  const dayIndex = body?.dayIndex as number | undefined;
  const mealIndex = body?.mealIndex as number | undefined;

  if (typeof dayIndex !== "number" || typeof mealIndex !== "number") {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const { data: plan, error: fetchError } = await supabase
    .from("meal_plans")
    .select("id, days")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (fetchError || !plan) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const days = plan.days as unknown as DayPlan[];
  const day = days[dayIndex];
  if (!day || !day.meals[mealIndex]) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  try {
    const profile = await getProfile(supabase, user.id);
    const newMeal = await ai.replaceMeal(day, mealIndex, toAiContext(profile));

    const updatedDays = days.map((d, i) =>
      i !== dayIndex ? d : { ...d, meals: d.meals.map((m, j) => (j === mealIndex ? newMeal : m)) }
    );

    const { error: updateError } = await supabase
      .from("meal_plans")
      .update({ days: updatedDays, shopping_list: buildShoppingList(updatedDays) })
      .eq("id", plan.id);

    if (updateError) throw updateError;

    return NextResponse.json({ meal: newMeal });
  } catch (err) {
    console.error("[api/meal-plan/replace-meal]", err);
    return NextResponse.json({ error: "replace_failed" }, { status: 500 });
  }
}
