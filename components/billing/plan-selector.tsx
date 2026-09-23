"use client";

import { useState, useTransition } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PLANS, TEST_BILLING_ENABLED } from "@/lib/billing";
import { activateTestPlanAction } from "@/lib/actions/billing";

type Plan = "monthly" | "weekly";

export function PlanSelector({
  currentPlan,
  isActive,
}: {
  currentPlan: Plan | null;
  isActive: boolean;
}) {
  const [selected, setSelected] = useState<Plan>(currentPlan ?? "monthly");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isCurrent = isActive && currentPlan === selected;

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      try {
        await activateTestPlanAction(selected);
      } catch {
        setError("Une erreur est survenue. Merci de réessayer.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {(Object.keys(PLANS) as Plan[]).map((plan) => {
          const info = PLANS[plan];
          const isSelected = selected === plan;
          return (
            <button
              key={plan}
              type="button"
              onClick={() => setSelected(plan)}
              className="text-left"
            >
              <Card
                className={cn(
                  "relative overflow-hidden transition-colors",
                  isSelected ? "border-primary bg-primary/5" : "hover:border-primary/40"
                )}
              >
                {plan === "monthly" && (
                  <div className="absolute right-4 top-0 rounded-b-lg bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    Le plus populaire
                  </div>
                )}
                <CardContent className="flex items-center gap-4 p-5">
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2",
                      isSelected ? "border-primary bg-primary" : "border-border"
                    )}
                  >
                    {isSelected && <span className="h-2.5 w-2.5 rounded-full bg-primary-foreground" />}
                  </span>
                  <div className="flex-1">
                    <p className="font-heading text-lg font-medium">{info.label}</p>
                    <p className="text-sm text-muted-foreground">Accès complet, sans limite</p>
                  </div>
                  <p className="shrink-0 text-right">
                    <span className="font-heading text-2xl font-medium">{info.price}</span>
                    <span className="block text-xs text-muted-foreground">{info.period}</span>
                  </p>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Paiement sécurisé. Aucune donnée bancaire stockée.
      </p>

      {error && <p className="text-center text-sm text-destructive">{error}</p>}

      {TEST_BILLING_ENABLED ? (
        <Button size="lg" onClick={handleSubmit} disabled={isPending || isCurrent}>
          {isCurrent
            ? "Formule actuelle"
            : isPending
              ? "Un instant…"
              : `Choisir le ${selected === "monthly" ? "mensuel" : "hebdomadaire"} · ${PLANS[selected].price}`}
        </Button>
      ) : (
        <Button size="lg" disabled>
          Bientôt disponible
        </Button>
      )}
      {TEST_BILLING_ENABLED && !isCurrent && (
        <p className="text-center text-xs text-muted-foreground">
          Mode test — aucun paiement n&apos;est prélevé pour le moment.
        </p>
      )}
    </div>
  );
}
