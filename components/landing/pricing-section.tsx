import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/billing";

export function PricingSection() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-16">
      <div className="mb-10 text-center">
        <h2 className="font-heading text-3xl font-medium">Un accompagnement simple</h2>
        <p className="mt-2 text-muted-foreground">
          Sans engagement, résiliable à tout moment. Aucune donnée bancaire stockée par nos soins.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Card className="border-primary bg-primary/5">
          <CardContent className="flex flex-col gap-4 p-6">
            <span className="w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
              Le plus populaire
            </span>
            <p className="font-heading text-xl font-medium">{PLANS.monthly.label}</p>
            <p>
              <span className="font-heading text-3xl font-medium">{PLANS.monthly.price}</span>
              <span className="text-muted-foreground"> {PLANS.monthly.period}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Accès complet : analyse de repas, recettes, coach IA.
            </p>
            <Button asChild size="lg">
              <Link href="/signup">Commencer mon accompagnement</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-4 p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-heading text-xl font-medium">{PLANS.weekly.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">Idéal pour essayer.</p>
              </div>
              <p className="shrink-0 text-right">
                <span className="font-heading text-2xl font-medium">{PLANS.weekly.price}</span>
                <span className="block text-xs text-muted-foreground">{PLANS.weekly.period}</span>
              </p>
            </div>
            <Button asChild variant="outline" size="lg">
              <Link href="/signup">Essayer l&apos;hebdomadaire</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
