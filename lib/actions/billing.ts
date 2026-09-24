"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { TEST_BILLING_ENABLED } from "@/lib/billing";

const PLAN_PERIOD_DAYS: Record<"monthly" | "weekly", number> = { monthly: 30, weekly: 7 };

/**
 * Active un abonnement en MODE TEST (pas de paiement réel — Stripe n'est pas encore branché).
 * Met à jour la table `subscriptions`, exactement comme le ferait un webhook Stripe
 * `checkout.session.completed` une fois le paiement réel connecté.
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

  revalidatePath("/abonnement");
  revalidatePath("/profil");
  revalidatePath("/dashboard");
}

/** Résilie l'abonnement en MODE TEST. */
export async function cancelTestPlanAction() {
  if (!TEST_BILLING_ENABLED) {
    throw new Error("Le paiement réel n'est pas encore configuré.");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("unauthorized");

  const { error } = await supabase
    .from("subscriptions")
    .update({ status: "canceled" })
    .eq("user_id", user.id);
  if (error) throw error;

  revalidatePath("/abonnement");
  revalidatePath("/profil");
  revalidatePath("/dashboard");
}

/** Met l'abonnement en pause pour N jours (reprise automatique à l'échéance, en MODE TEST). */
export async function pauseTestPlanAction(days: 7 | 14 | 30) {
  if (!TEST_BILLING_ENABLED) {
    throw new Error("Le paiement réel n'est pas encore configuré.");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("unauthorized");

  const pausedUntil = new Date();
  pausedUntil.setDate(pausedUntil.getDate() + days);

  const { error } = await supabase
    .from("subscriptions")
    .update({ status: "paused", paused_until: pausedUntil.toISOString() })
    .eq("user_id", user.id);
  if (error) throw error;

  revalidatePath("/abonnement");
  revalidatePath("/profil");
  revalidatePath("/dashboard");
}

/** Reprend un abonnement en pause avant l'échéance prévue (MODE TEST). */
export async function resumeTestPlanAction() {
  if (!TEST_BILLING_ENABLED) {
    throw new Error("Le paiement réel n'est pas encore configuré.");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("unauthorized");

  const { error } = await supabase
    .from("subscriptions")
    .update({ status: "active", paused_until: null })
    .eq("user_id", user.id);
  if (error) throw error;

  revalidatePath("/abonnement");
  revalidatePath("/profil");
  revalidatePath("/dashboard");
}
