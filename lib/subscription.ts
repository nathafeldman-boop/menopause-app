import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./supabase/database.types";

export type SubscriptionPlan = "none" | "weekly" | "monthly";
export type SubscriptionStatus = "inactive" | "active" | "canceled" | "paused";

export async function hasActiveSubscription(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from("subscriptions")
    .select("status, paused_until")
    .eq("user_id", userId)
    .single();

  if (data?.status === "paused" && data.paused_until && new Date(data.paused_until) <= new Date()) {
    // Pas de webhook/cron en mode test : la reprise après pause se déclenche paresseusement
    // à la prochaine lecture, une fois l'échéance dépassée.
    await supabase
      .from("subscriptions")
      .update({ status: "active", paused_until: null })
      .eq("user_id", userId);
    return true;
  }

  return data?.status === "active";
}
