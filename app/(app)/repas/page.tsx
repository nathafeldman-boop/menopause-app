import Link from "next/link";
import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { getScoreColorVar } from "@/lib/score";
import { formatMealTime } from "@/lib/meal-labels";

export const metadata: Metadata = { title: "Mes repas" };

const DAY_LETTERS = ["L", "M", "M", "J", "V", "S", "D"];

function dayGroupLabel(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  if (d.getTime() === today.getTime()) return "Aujourd'hui";
  if (d.getTime() === yesterday.getTime()) return "Hier";
  return date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "short" });
}

export default async function MealsHistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: meals } = await supabase
    .from("meal_analyses")
    .select("id, image_path, meal_name, score, created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const now = new Date();
  const startOfWeek = new Date(now);
  const isoWeekday = (now.getDay() + 6) % 7; // 0 = lundi
  startOfWeek.setDate(now.getDate() - isoWeekday);
  startOfWeek.setHours(0, 0, 0, 0);

  const weekActivity = DAY_LETTERS.map((_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    const hasActivity = (meals ?? []).some((m) => {
      const d = new Date(m.created_at);
      return (
        d.getFullYear() === day.getFullYear() &&
        d.getMonth() === day.getMonth() &&
        d.getDate() === day.getDate()
      );
    });
    return hasActivity;
  });
  const weekCount = weekActivity.filter(Boolean).length;

  const withUrls = await Promise.all(
    (meals ?? []).map(async (meal) => {
      const { data } = await supabase.storage.from("photos").createSignedUrl(meal.image_path, 3600);
      return { ...meal, url: data?.signedUrl ?? null };
    })
  );

  const groups: { label: string; meals: typeof withUrls }[] = [];
  for (const meal of withUrls) {
    const label = dayGroupLabel(new Date(meal.created_at));
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.label === label) {
      lastGroup.meals.push(meal);
    } else {
      groups.push({ label, meals: [meal] });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-medium">Mes repas</h1>

      <Card>
        <CardContent className="p-5">
          <p className="font-heading text-2xl font-medium">
            {weekCount} repas cette semaine
          </p>
          <div className="mt-4 flex justify-between">
            {DAY_LETTERS.map((letter, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <span
                  className={
                    weekActivity[i]
                      ? "h-8 w-8 rounded-full border-2 border-secondary bg-secondary/15"
                      : "h-8 w-8 rounded-full border-2 border-border"
                  }
                />
                <span className="text-xs text-muted-foreground">{letter}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {withUrls.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
            <p className="text-muted-foreground">Vous n&apos;avez pas encore analysé de repas.</p>
            <Link href="/repas/nouveau" className="text-primary underline underline-offset-4">
              Analyser mon premier repas
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-5">
          {groups.map((group) => (
            <div key={group.label} className="flex flex-col gap-2.5">
              <p className="text-sm font-medium capitalize text-muted-foreground">{group.label}</p>
              <div className="flex flex-col gap-2.5">
                {group.meals.map((meal) => (
                  <Link key={meal.id} href={`/repas/${meal.id}`}>
                    <Card className="transition-colors hover:bg-muted/50">
                      <CardContent className="flex items-center gap-4 p-3">
                        {meal.url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={meal.url}
                            alt=""
                            className="h-14 w-14 shrink-0 rounded-xl object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-medium leading-snug">
                            {meal.meal_name || "Repas analysé"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatMealTime(meal.created_at)}
                          </p>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-heading text-lg font-medium leading-none">
                            {meal.score}
                          </span>
                          <span
                            className="h-0.5 w-5 rounded-full"
                            style={{ backgroundColor: getScoreColorVar(meal.score ?? 0) }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
