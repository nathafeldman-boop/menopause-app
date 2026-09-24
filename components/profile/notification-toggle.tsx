"use client";

import { useState, useTransition } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { setNotificationsEnabledAction } from "@/lib/actions/notifications";

export function NotificationToggle({ initialEnabled }: { initialEnabled: boolean }) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [, startTransition] = useTransition();

  function handleChange(checked: boolean) {
    setEnabled(checked);
    startTransition(async () => {
      try {
        await setNotificationsEnabledAction(checked);
      } catch {
        setEnabled(!checked);
      }
    });
  }

  return (
    <label className="flex items-center justify-between gap-4 py-1 text-sm">
      <span>
        Notifications utiles
        <span className="block text-xs text-muted-foreground">
          Rappel du soir si rien n&apos;a été fait aujourd&apos;hui
        </span>
      </span>
      <Checkbox checked={enabled} onChange={(e) => handleChange(e.target.checked)} />
    </label>
  );
}
