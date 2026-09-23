import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./supabase/database.types";
import { getProfile, toAiContext } from "./profile";
import { hasActiveSubscription } from "./subscription";
import { ai } from "./ai";

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
      is_teaser: !subscribed,
    })
    .select("id, days, is_teaser")
    .single();

  if (error) throw error;
  return row;
}
