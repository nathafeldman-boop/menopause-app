import Link from "next/link";
import { ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScoreGauge } from "@/components/meal/score-gauge";

export function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-5 pb-16 pt-10 sm:pt-16">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-6">
          <span className="w-fit rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-muted-foreground">
            Coach alimentaire · Ménopause
          </span>
          <h1 className="font-heading text-4xl font-medium leading-[1.1] sm:text-5xl">
            Bien manger pendant la ménopause,{" "}
            <em className="text-primary italic">sans régime compliqué.</em>
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Photographiez votre assiette. Alma vous dit ce qui est déjà bien et ce que vous
            pourriez ajouter, simplement.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/signup">Analyser mon premier repas</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Dans votre navigateur, sans téléchargement.
            <br />
            Ne remplace pas l&apos;avis d&apos;un professionnel de santé.
          </p>
        </div>

        <div className="relative">
          <div className="mx-auto w-full max-w-sm">
            <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-border bg-muted/50 text-muted-foreground">
              <ImageIcon className="h-7 w-7" strokeWidth={1.5} />
              <span className="text-sm">Photo : une assiette colorée</span>
            </div>

            <div className="-mt-10 ml-6 flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-[0_20px_50px_-20px_rgba(43,36,32,0.3)] sm:mr-6">
              <ScoreGauge score={82} />
              <div>
                <p className="font-heading font-medium leading-tight">Bel équilibre</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Ajoutez un yaourt ou quelques amandes pour le calcium.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
