"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Message = { id: string; role: "user" | "assistant"; content: string };

const SUGGESTED_QUESTIONS = [
  "Que manger ce soir ?",
  "J'ai envie de grignoter, que puis-je prendre ?",
  "Que puis-je cuisiner avec ce que j'ai ?",
  "Comment adapter cette recette ?",
];

export function CoachChat({
  conversationId,
  initialMessages,
}: {
  conversationId: string;
  initialMessages: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setError(null);
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", content: trimmed }]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, message: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "failed");

      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: data.reply },
      ]);
    } catch {
      setError("Une erreur est survenue. Merci de réessayer.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-border bg-muted/50 p-3 text-xs text-muted-foreground">
        Ce coach donne des conseils alimentaires généraux et ne remplace pas l&apos;avis d&apos;un
        professionnel de santé.
      </div>

      <div className="flex flex-col gap-3">
        {messages.length === 0 && (
          <div className="max-w-[85%] self-start rounded-2xl bg-muted px-4 py-3 text-sm leading-relaxed text-foreground">
            Bonjour ! Une envie, une question sur un repas ? Choisissez une suggestion ou
            écrivez-moi.
          </div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed",
              m.role === "user"
                ? "self-end bg-primary text-primary-foreground"
                : "self-start bg-muted text-foreground"
            )}
          >
            {m.content}
          </div>
        ))}
        {sending && (
          <div className="self-start rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
            …
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length === 0 && (
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => send(q)}
              className="rounded-full border border-border bg-card px-3 py-2 text-sm transition-colors hover:border-primary/50 hover:bg-primary/5"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-end gap-2"
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          placeholder="Écrivez votre question…"
          rows={1}
          className="min-h-12 flex-1 resize-none"
        />
        <Button type="submit" size="icon" disabled={sending || !input.trim()} aria-label="Envoyer">
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}
