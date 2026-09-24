"use client";

import { useState, useTransition } from "react";
import { Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { resumeTestPlanAction } from "@/lib/actions/billing";

export function ResumeSubscriptionButton() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      try {
        await resumeTestPlanAction();
      } catch {
        setError("Une erreur est survenue. Merci de réessayer.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <Button className="w-full" onClick={handleClick} disabled={isPending}>
        <Play className="h-4 w-4" /> {isPending ? "Un instant…" : "Reprendre maintenant"}
      </Button>
      {error && <p className="text-center text-sm text-destructive">{error}</p>}
    </div>
  );
}
