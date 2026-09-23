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
  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <h2 className="mb-8 text-center font-heading text-3xl font-medium">Questions fréquentes</h2>
      <div className="flex flex-col divide-y divide-border">
        {FAQS.map(({ q, a }) => (
          <div key={q} className="py-5">
            <p className="font-medium">{q}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
