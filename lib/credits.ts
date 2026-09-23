import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./supabase/database.types";

/** Coûts en crédits par action IA (fidèles au brief produit). */
export const CREDIT_COSTS = {
  meal_analysis: 3,
  recipe_scan: 5,
  recipe_adapt: 5,
  ingredients_recipe: 5,
  meal_plan: 10,
  deep_analysis: 15,
} as const;

export type CreditReason = keyof typeof CREDIT_COSTS;

export class InsufficientCreditsError extends Error {
  constructor(public required: number) {
    super("Solde de crédits insuffisant");
    this.name = "InsufficientCreditsError";
  }
}

/**
 * Débite atomiquement le solde de l'utilisateur connecté via la fonction Postgres
 * `spend_credits` (RLS + auth.uid() côté serveur), et journalise la transaction.
 */
export async function spendCredits(
  supabase: SupabaseClient<Database>,
  reason: CreditReason,
  relatedId?: string
): Promise<number> {
  const cost = CREDIT_COSTS[reason];

  const { data, error } = await supabase.rpc("spend_credits", {
    p_reason: reason,
    p_cost: cost,
    p_related_id: relatedId,
  });

  if (error) {
    if (error.message.includes("insufficient_credits")) {
      throw new InsufficientCreditsError(cost);
    }
    throw error;
  }

  return data as number;
}

/**
 * Ajoute des crédits au solde de l'utilisateur connecté (abonnement activé, pack acheté…)
 * et journalise la transaction. Réutilise la fonction Postgres `refund_credits`, qui est en
 * réalité une simple addition atomique + entrée de ledger, générique à tout crédit entrant.
 */
export async function grantCredits(
  supabase: SupabaseClient<Database>,
  amount: number,
  reason: string
): Promise<number> {
  const { data, error } = await supabase.rpc("refund_credits", {
    p_amount: amount,
    p_reason: reason,
  });
  if (error) throw error;
  return data as number;
}

/**
 * Rembourse un débit qui n'a pas pu aboutir (ex: l'action a été débitée mais a échoué
 * avant de produire un résultat). Best-effort : les erreurs sont volontairement avalées
 * par l'appelant pour ne pas masquer l'erreur d'origine.
 */
export async function refundCredits(
  supabase: SupabaseClient<Database>,
  reason: CreditReason,
  relatedId?: string
): Promise<void> {
  const amount = CREDIT_COSTS[reason];
  await supabase.rpc("refund_credits", {
    p_amount: amount,
    p_reason: `refund_${reason}`,
    p_related_id: relatedId,
  });
}
