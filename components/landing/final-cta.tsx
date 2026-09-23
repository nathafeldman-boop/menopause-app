import Link from "next/link";

import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <div className="rounded-3xl bg-muted px-6 py-14 text-center sm:px-12">
        <h2 className="text-balance font-heading text-3xl font-medium sm:text-4xl">
          Votre prochain repas peut être votre premier conseil.
        </h2>
        <Button asChild size="lg" className="mt-6">
          <Link href="/signup">Analyser mon premier repas</Link>
        </Button>
      </div>
    </section>
  );
}
