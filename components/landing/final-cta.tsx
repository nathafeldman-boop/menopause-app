import Link from "next/link";

import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-20 text-center">
      <h2 className="font-heading text-3xl font-medium sm:text-4xl">
        Prête à mieux manger, simplement ?
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
        Créez votre compte en 2 minutes et analysez votre premier repas dès aujourd&apos;hui.
      </p>
      <Button asChild size="lg" className="mt-6">
        <Link href="/signup">Analyser mon premier repas</Link>
      </Button>
    </section>
  );
}
