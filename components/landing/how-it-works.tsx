const STEPS = [
  {
    title: "Prenez votre repas en photo",
    description: "Pas de pesée, pas de calories.",
  },
  {
    title: "Découvrez son équilibre",
    description: "Protéines, fibres, calcium : l'essentiel.",
  },
  {
    title: "Suivez 2 ou 3 conseils simples",
    description: "Concrets, jamais culpabilisants.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-16">
      <h2 className="mb-8 font-heading text-3xl font-medium">Comment ça marche</h2>
      <div className="flex flex-col gap-6">
        {STEPS.map((step, i) => (
          <div key={step.title} className="flex items-start gap-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
              {i + 1}
            </span>
            <div>
              <p className="font-heading text-lg font-medium leading-snug">{step.title}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
