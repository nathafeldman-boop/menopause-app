"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LockedContent } from "@/components/billing/locked-content";
import type { DayPlan } from "@/lib/ai/types";

const WEEK_DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export function MealPlanView({ days, isTeaser }: { days: DayPlan[]; isTeaser: boolean }) {
  const [planDays, setPlanDays] = useState(days);
  const [replacing, setReplacing] = useState<string | null>(null);
  const lockedDays = isTeaser ? WEEK_DAYS.slice(planDays.length) : [];

  async function replaceMeal(dayIndex: number, mealIndex: number) {
    const key = `${dayIndex}-${mealIndex}`;
    setReplacing(key);
    try {
      const res = await fetch("/api/meal-plan/replace-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dayIndex, mealIndex }),
      });
      if (!res.ok) return;
      const { meal } = await res.json();
      setPlanDays((prev) =>
        prev.map((d, i) =>
          i !== dayIndex ? d : { ...d, meals: d.meals.map((m, j) => (j === mealIndex ? meal : m)) }
        )
      );
    } finally {
      setReplacing(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {planDays.map((day, dayIndex) => (
        <Card key={day.day}>
          <CardContent className="p-5">
            <h3 className="mb-3 font-heading text-lg font-medium">{day.day}</h3>
            <div className="flex flex-col gap-3">
              {day.meals.map((meal, mealIndex) => {
                const key = `${dayIndex}-${mealIndex}`;
                return (
                  <div key={mealIndex} className="flex items-start justify-between gap-3 text-sm">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {meal.type}
                      </span>
                      <span className="font-medium">{meal.name}</span>
                      <span className="text-muted-foreground">{meal.description}</span>
                    </div>
                    {!isTeaser && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={replacing === key}
                        onClick={() => replaceMeal(dayIndex, mealIndex)}
                        className="shrink-0 text-muted-foreground"
                      >
                        <RefreshCw className={replacing === key ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} />
                        Remplacer
                      </Button>
                    )}
                  </div>
                );
              })}
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
