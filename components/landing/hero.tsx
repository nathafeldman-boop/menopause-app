import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ScoreGauge } from "@/components/meal/score-gauge";

export function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-5 pb-16 pt-10 sm:pt-16">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-6">
          <h1 className="font-heading text-4xl font-medium leading-[1.1] sm:text-5xl">
            Bien manger pendant la ménopause, sans régime compliqué.
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Photographiez votre repas, votre recette ou les ingrédients de votre frigo. Votre
            coach vous aide à comprendre quoi améliorer et quoi préparer.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/signup">Analyser mon premier repas</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Web app accessible directement depuis votre navigateur, sur mobile comme sur
            ordinateur. Ne remplace pas l&apos;avis d&apos;un professionnel de santé.
          </p>
        </div>

        <div className="relative">
          <div className="mx-auto w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-[0_20px_50px_-20px_rgba(43,36,32,0.25)]">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-12 w-12 shrink-0 rounded-xl bg-muted" />
              <div>
                <p className="text-xs text-muted-foreground">Votre repas</p>
                <p className="font-heading font-medium leading-tight">
                  Poêlée de légumes, poulet &amp; riz complet
                </p>
              </div>
            </div>
            <ScoreGauge score={82} />
            <div className="mt-5 flex flex-col gap-2 text-sm">
              <p className="flex gap-2">
                <span className="text-secondary">●</span>
                Bonne source de protéines et de légumes
              </p>
              <p className="flex gap-2">
                <span className="text-accent">●</span>
                Ajoutez une source de calcium pour équilibrer
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
