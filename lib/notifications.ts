import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./supabase/database.types";
import type { DayPlan } from "./ai/types";
import { todayWeekdayName } from "./daily-progress";
import { currentHourParis, startOfDayParisIso, todayDateStringParis } from "./timezone";

/** Pas de vraie notification push navigateur ici (service worker + permission + clé VAPID :
 * une décision d'infra séparée, hors scope ici). Ce sont des notifications strictement in-app :
 * elles n'apparaissent que la prochaine fois que l'utilisatrice ouvre l'application, jamais en
 * son absence — mais elles PERSISTENT (avec badge non-lu) au-delà de la page où elles ont été
 * générées, contrairement à une carte du dashboard qui disparaît dès qu'on change de page. */
export async function createNotification(
  supabase: SupabaseClient<Database>,
  userId: string,
  notification: { kind: string; title: string; body?: string; href?: string }
) {
  await supabase.from("notifications").insert({ user_id: userId, ...notification });
}

/** Notification du soir, générée paresseusement à la prochaine visite du dashboard (pas de cron
 * ni de push réel possible sans infra dédiée) : au plus une par jour, seulement le soir, et
 * seulement si les notifications sont activées pour cette utilisatrice. Deux cas mutuellement
 * exclusifs : un dîner est prévu et pas encore fait → rappel ; sinon, aucune activité aujourd'hui
 * → petite relance vers SOS repas. */
export async function ensureEveningNotification(supabase: SupabaseClient<Database>, userId: string) {
  const hour = currentHourParis();
  if (hour < 18 || hour > 22) return;

  const { data: profile } = await supabase
    .from("profiles")
    .select("notifications_enabled")
    .eq("id", userId)
    .single();
  if (!profile?.notifications_enabled) return;

  const startOfDayIso = startOfDayParisIso();
  const todayDate = todayDateStringParis();

  const { data: existing } = await supabase
    .from("notifications")
    .select("id")
    .eq("user_id", userId)
    .eq("kind", "evening")
    .gte("created_at", startOfDayIso)
    .maybeSingle();
  if (existing) return;

  const [{ data: plan }, { data: progress }, { count: mealsToday }] = await Promise.all([
    supabase
      .from("meal_plans")
      .select("days, restaurant_days")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("daily_progress")
      .select("mood, meals_done")
      .eq("user_id", userId)
      .eq("progress_date", todayDate)
      .maybeSingle(),
    supabase
      .from("meal_analyses")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", startOfDayIso),
  ]);

  const todayName = todayWeekdayName();
  const days = (plan?.days ?? []) as unknown as DayPlan[];
  const isRestaurantDay = plan?.restaurant_days?.includes(todayName) ?? false;
  const dinner = !isRestaurantDay
    ? days.find((d) => d.day === todayName)?.meals.find((m) => m.type === "Dîner")
    : undefined;
  const dinnerDone = progress?.meals_done?.includes("Dîner") ?? false;

  if (dinner && !dinnerDone) {
    await createNotification(supabase, userId, {
      kind: "evening",
      title: "🍲 Ton dîner de ce soir",
      body: dinner.name,
      href: "/dashboard",
    });
    return;
  }

  const hasActivityToday = (mealsToday ?? 0) > 0 || !!progress?.mood;
  if (!hasActivityToday) {
    await createNotification(supabase, userId, {
      kind: "evening",
      title: "Besoin d'une idée pour ce soir ? 🍽️",
      body: "Trois questions et une suggestion immédiate.",
      href: "/sos",
    });
  }
}
