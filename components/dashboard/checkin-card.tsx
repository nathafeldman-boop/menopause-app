"use client";

import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MOODS = [
  { value: "great", emoji: "😊", label: "Très bien" },
  { value: "good", emoji: "🙂", label: "Bien" },
  { value: "neutral", emoji: "😐", label: "Moyenne" },
  { value: "hard", emoji: "😕", label: "Difficile" },
];

export function CheckInCard({ alreadyDone }: { alreadyDone: boolean }) {
  const [mood, setMood] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(alreadyDone);

  async function handleSubmit() {
    if (!mood) return;
    setSubmitting(true);
    try {
      await fetch("/api/daily-progress/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, note }),
      });
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <Card>
        <CardContent className="p-5 text-center text-sm text-muted-foreground">
          Merci pour votre retour 🌿 À demain !
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-5">
        <p className="font-heading text-lg font-medium">Comment s&apos;est passée votre journée ?</p>
        <div className="grid grid-cols-4 gap-2">
          {MOODS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMood(m.value)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl border border-border py-3 text-xs transition-colors",
                mood === m.value ? "border-primary bg-primary/10" : "hover:bg-muted/60"
              )}
            >
              <span className="text-xl">{m.emoji}</span>
              {m.label}
            </button>
          ))}
        </div>
        {mood && (
          <>
            <Textarea
              placeholder="Qu'est-ce qui vous a le plus compliqué aujourd'hui ? (facultatif)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
            />
            <Button onClick={handleSubmit} disabled={submitting} size="sm">
              {submitting ? "Envoi…" : "Valider"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
