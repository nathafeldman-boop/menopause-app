import { Card, CardContent } from "@/components/ui/card";
import { LockedContent } from "@/components/billing/locked-content";
import type { DayPlan } from "@/lib/ai/types";

const WEEK_DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export function MealPlanView({ days, isTeaser }: { days: DayPlan[]; isTeaser: boolean }) {
  const lockedDays = isTeaser ? WEEK_DAYS.slice(days.length) : [];

  return (
    <div className="flex flex-col gap-4">
      {days.map((day) => (
        <Card key={day.day}>
          <CardContent className="p-5">
            <h3 className="mb-3 font-heading text-lg font-medium">{day.day}</h3>
            <div className="flex flex-col gap-3">
              {day.meals.map((meal, i) => (
                <div key={i} className="flex flex-col gap-0.5 text-sm">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {meal.type}
                  </span>
                  <span className="font-medium">{meal.name}</span>
                  <span className="text-muted-foreground">{meal.description}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {lockedDays.map((day) => (
        <LockedContent
          key={day}
          label={day}
          description="Jour verrouillé"
          lines={2}
          showCta={false}
        />
      ))}
    </div>
  );
}
