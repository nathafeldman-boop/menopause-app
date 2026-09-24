import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./supabase/database.types";

/** Agrège les corrections passées d'une utilisatrice en indices textuels courts,
 * les paires les plus fréquentes en premier — à injecter comme contexte facultatif
 * dans le prompt de ses prochaines analyses (jamais comme règle automatique). */
export async function getCorrectionHints(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<string[]> {
  const { data } = await supabase
    .from("food_corrections")
    .select("detected_food, corrected_food")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (!data || data.length === 0) return [];

  const counts = new Map<string, number>();
  for (const row of data) {
    const key = `${row.detected_food.toLowerCase()} → ${row.corrected_food.toLowerCase()}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([pair, count]) => `"${pair}" (${count} fois)`);
}
