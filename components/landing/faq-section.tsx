"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Alma remplace-t-elle un médecin ou une diététicienne ?",
    a: "Non. Alma propose des conseils alimentaires généraux et prudents. Elle ne diagnostique aucune maladie et ne remplace pas l'avis d'un professionnel de santé, notamment en cas de douleur ou de symptôme.",
  },
  {
    q: "L'analyse de repas donne-t-elle des calories exactes ?",
    a: "Non, et c'est volontaire. Une photo ne permet pas de connaître précisément les quantités. Alma reste honnête : elle donne un équilibre général et des conseils qualitatifs plutôt que d'inventer des chiffres.",
  },
  {
    q: "Est-ce que je vais perdre du poids ?",
    a: "Alma vous aide à mieux structurer votre alimentation au quotidien. Nous ne promettons aucun résultat de perte de poids précis ou garanti : chaque parcours est différent.",
  },
  {
    q: "Puis-je annuler à tout moment ?",
    a: "Oui, votre abonnement n'est jamais engageant : vous pouvez l'arrêter quand vous le souhaitez depuis votre profil.",
  },
  {
    q: "Mes photos et mes données sont-elles privées ?",
    a: "Oui. Vos photos et analyses vous sont strictement personnelles. Nous ne stockons jamais vos données bancaires : les paiements sont gérés par un prestataire de paiement sécurisé.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <h2 className="mb-8 text-center font-heading text-3xl font-medium">Questions fréquentes</h2>
      <div className="flex flex-col gap-3">
        {FAQS.map(({ q, a }, i) => {
          const open = openIndex === i;
          return (
            <div
              key={q}
              className="rounded-2xl border border-border bg-card"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                aria-expanded={open}
              >
                <span className="font-medium">{q}</span>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
                  {open ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                </span>
              </button>
              <div
                className={cn(
                  "grid transition-all duration-200 ease-in-out",
                  open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">{a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
