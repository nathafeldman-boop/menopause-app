import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./supabase/database.types";

export type SubscriptionPlan = "none" | "weekly" | "monthly";
export type SubscriptionStatus = "inactive" | "active" | "canceled";

export async function hasActiveSubscription(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", userId)
    .single();

  return data?.status === "active";
}
