"use client";

import { useState, useTransition } from "react";
import { Pause } from "lucide-react";

import { Button } from "@/components/ui/button";
import { pauseTestPlanAction } from "@/lib/actions/billing";
import { cn } from "@/lib/utils";

const DURATIONS: Array<{ days: 7 | 14 | 30; label: string }> = [
  { days: 7, label: "7 jours" },
  { days: 14, label: "14 jours" },
  { days: 30, label: "30 jours" },
];

export function PauseSubscriptionButton() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<7 | 14 | 30>(7);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (!open) {
    return (
      <Button variant="outline" className="w-full" onClick={() => setOpen(true)}>
        <Pause className="h-4 w-4" /> Mettre mon abonnement en pause
      </Button>
    );
  }

  function confirm() {
    setError(null);
    startTransition(async () => {
      try {
        await pauseTestPlanAction(selected);
      } catch {
        setError("Une erreur est survenue. Merci de réessayer.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border p-4">
      <p className="text-sm font-medium">Pendant combien de temps ?</p>
      <div className="grid grid-cols-3 gap-2">
        {DURATIONS.map((d) => (
          <button
            key={d.days}
            type="button"
            onClick={() => setSelected(d.days)}
            className={cn(
              "rounded-lg border py-2 text-sm transition-colors",
              selected === d.days ? "border-primary bg-primary/10" : "border-border hover:bg-muted/60"
            )}
          >
            {d.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        L&apos;accès aux fonctionnalités sera suspendu, puis repris automatiquement à l&apos;échéance.
      </p>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button variant="ghost" className="flex-1" onClick={() => setOpen(false)} disabled={isPending}>
          Annuler
        </Button>
        <Button className="flex-1" onClick={confirm} disabled={isPending}>
          {isPending ? "Un instant…" : "Confirmer la pause"}
        </Button>
      </div>
    </div>
  );
}
