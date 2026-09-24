import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./supabase/database.types";
import { todayWeekdayNameParis, todayDateStringParis } from "./timezone";

export function todayWeekdayName() {
  return todayWeekdayNameParis();
}

export function todayDateString() {
  return todayDateStringParis();
}

export async function getTodayProgress(supabase: SupabaseClient<Database>, userId: string) {
  const { data } = await supabase
    .from("daily_progress")
    .select("meals_done, mood, note")
    .eq("user_id", userId)
    .eq("progress_date", todayDateString())
    .maybeSingle();

  return data ?? { meals_done: [] as string[], mood: null, note: null };
}

export async function upsertTodayProgress(
  supabase: SupabaseClient<Database>,
  userId: string,
  patch: Partial<{ meals_done: string[]; mood: string; note: string | null }>
) {
  const date = todayDateString();
  const { data: existing } = await supabase
    .from("daily_progress")
    .select("id")
    .eq("user_id", userId)
    .eq("progress_date", date)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from("daily_progress").update(patch).eq("id", existing.id);
    if (error) throw error;
    return;
  }

  const { error } = await supabase
    .from("daily_progress")
    .insert({ user_id: userId, progress_date: date, ...patch });
  if (error) throw error;
}
