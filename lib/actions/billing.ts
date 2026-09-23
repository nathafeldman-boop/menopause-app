"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { grantCredits } from "@/lib/credits";
import { TEST_BILLING_ENABLED } from "@/lib/billing";

const PLAN_CREDITS: Record<"monthly" | "weekly", number> = { monthly: 100, weekly: 25 };
const PLAN_PERIOD_DAYS: Record<"monthly" | "weekly", number> = { monthly: 30, weekly: 7 };
const PACK_CREDITS: Record<"pack_100" | "pack_500", number> = { pack_100: 100, pack_500: 500 };

/**
 * Active un abonnement en MODE TEST (pas de paiement réel — Stripe n'est pas encore branché).
 * Met à jour la table `subscriptions` et crédite le compte, exactement comme le ferait un
 * webhook Stripe `checkout.session.completed` une fois le paiement réel connecté.
 */
export async function activateTestPlanAction(plan: "monthly" | "weekly") {
  if (!TEST_BILLING_ENABLED) {
    throw new Error("Le paiement réel n'est pas encore configuré.");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("unauthorized");

  const periodEnd = new Date();
  periodEnd.setDate(periodEnd.getDate() + PLAN_PERIOD_DAYS[plan]);

  const { error } = await supabase
    .from("subscriptions")
    .update({ plan, status: "active", current_period_end: periodEnd.toISOString() })
    .eq("user_id", user.id);
  if (error) throw error;

  await grantCredits(supabase, PLAN_CREDITS[plan], `test_subscription_${plan}`);

  revalidatePath("/abonnement");
  revalidatePath("/profil");
}

/** Achat de crédits en MODE TEST — voir activateTestPlanAction. */
export async function buyTestCreditPackAction(pack: "pack_100" | "pack_500") {
  if (!TEST_BILLING_ENABLED) {
    throw new Error("Le paiement réel n'est pas encore configuré.");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("unauthorized");

  await grantCredits(supabase, PACK_CREDITS[pack], `test_pack_${pack}`);

  revalidatePath("/abonnement");
  revalidatePath("/profil");
}
