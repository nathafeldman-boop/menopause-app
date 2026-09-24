import { randomUUID } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./supabase/database.types";
import { getProfile, toAiContext } from "./profile";
import { hasActiveSubscription } from "./subscription";
import { ai } from "./ai";
import type { ShoppingListItem, WeeklyMealPlan } from "./ai/types";

export function buildShoppingList(
  days: WeeklyMealPlan["days"],
  excludeDays: string[] = []
): ShoppingListItem[] {
  const seen = new Map<string, ShoppingListItem>();

  for (const day of days) {
    if (excludeDays.includes(day.day)) continue;
    for (const meal of day.meals) {
      for (const ingredient of meal.ingredients ?? []) {
        const key = ingredient.text.trim().toLowerCase();
        if (!key || seen.has(key)) continue;
        seen.set(key, {
          id: randomUUID(),
          text: ingredient.text,
          category: ingredient.category,
          checked: false,
        });
      }
    }
  }

  return Array.from(seen.values());
}

export async function generateWeeklyPlanForUser(
  supabase: SupabaseClient<Database>,
  userId: string
) {
  const subscribed = await hasActiveSubscription(supabase, userId);
  const profile = await getProfile(supabase, userId);

  const plan = await ai.generateWeeklyMealPlan(
    toAiContext(profile),
    profile?.todays_meals ?? "",
    !subscribed
  );

  const { data: row, error } = await supabase
    .from("meal_plans")
    .insert({
      user_id: userId,
      days: plan.days,
      shopping_list: buildShoppingList(plan.days),
      is_teaser: !subscribed,
    })
    .select("id, days, is_teaser, shopping_list, restaurant_days")
    .single();

  if (error) throw error;
  return row;
}
