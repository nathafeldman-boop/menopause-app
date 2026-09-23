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
        <Card className="relative overflow-hidden border-primary bg-primary/5">
          <div className="absolute right-0 top-0 rounded-bl-lg bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
            Le plus populaire
          </div>
          <CardContent className="flex flex-col gap-4 p-6">
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
            <p className="font-heading text-xl font-medium">{PLANS.weekly.label}</p>
            <p>
              <span className="font-heading text-3xl font-medium">{PLANS.weekly.price}</span>
              <span className="text-muted-foreground"> {PLANS.weekly.period}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Accès complet, idéal pour essayer.
            </p>
            <Button asChild variant="outline" size="lg">
              <Link href="/signup">Essayer l&apos;hebdomadaire</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
