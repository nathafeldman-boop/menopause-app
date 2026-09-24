import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { buildShoppingList } from "@/lib/meal-plan";
import type { DayPlan } from "@/lib/ai/types";

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const day = body?.day as string | undefined;

  if (!day) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const { data: plan, error: fetchError } = await supabase
    .from("meal_plans")
    .select("id, days, restaurant_days")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (fetchError || !plan) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const days = plan.days as unknown as DayPlan[];
  const isRestaurantDay = plan.restaurant_days.includes(day);
  const restaurantDays = isRestaurantDay
    ? plan.restaurant_days.filter((d) => d !== day)
    : [...plan.restaurant_days, day];

  const { error: updateError } = await supabase
    .from("meal_plans")
    .update({ restaurant_days: restaurantDays, shopping_list: buildShoppingList(days, restaurantDays) })
    .eq("id", plan.id);

  if (updateError) {
    return NextResponse.json({ error: "update_failed" }, { status: 500 });
  }

  return NextResponse.json({ restaurantDays });
}
