"use client";

import { useState } from "react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { PlannedMeal } from "@/lib/ai/types";

export function TodayPlanCard({
  meals,
  initialDone,
  goalLabel,
}: {
  meals: PlannedMeal[];
  initialDone: string[];
  goalLabel: string | null;
}) {
  const [done, setDone] = useState(new Set(initialDone));

  async function toggle(mealType: string, checked: boolean) {
    setDone((prev) => {
      const next = new Set(prev);
      if (checked) next.add(mealType);
      else next.delete(mealType);
      return next;
    });
    try {
      await fetch("/api/daily-progress/meal", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mealType, done: checked }),
      });
    } catch {
      setDone((prev) => {
        const next = new Set(prev);
        if (checked) next.delete(mealType);
        else next.add(mealType);
        return next;
      });
    }
  }

  return (
    <Card>
      <CardContent className="p-5">
        <h2 className="font-heading text-lg font-medium">Aujourd&apos;hui</h2>

        {meals.length === 0 ? (
          <div className="mt-3 flex flex-col items-start gap-2">
            <p className="text-sm text-muted-foreground">
              Générez votre plan de la semaine pour voir vos repas du jour.
            </p>
            <Button asChild size="sm" variant="outline">
              <Link href="/plan">Créer mon plan</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-3 flex flex-col">
            {meals.map((meal) => (
              <label
                key={meal.type}
                className="flex items-center justify-between gap-3 border-b border-border py-3 text-sm last:border-0"
              >
                <div>
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {meal.type}
                  </span>
                  <p className={done.has(meal.type) ? "text-muted-foreground line-through" : "font-medium"}>
                    {meal.name}
                  </p>
                </div>
                <Checkbox
                  checked={done.has(meal.type)}
                  onChange={(e) => toggle(meal.type, e.target.checked)}
                />
              </label>
            ))}
          </div>
        )}

        {goalLabel && (
          <p className="mt-4 text-sm text-muted-foreground">🥗 Objectif du jour : {goalLabel}</p>
        )}
      </CardContent>
    </Card>
  );
}
