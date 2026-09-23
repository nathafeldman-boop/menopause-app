import Link from "next/link";

export function SubscriptionRequiredBanner() {
  return (
    <div className="rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm">
      <p className="font-medium">Cette fonctionnalité nécessite un abonnement actif.</p>
      <p className="mt-1 text-muted-foreground">
        <Link href="/abonnement" className="text-primary underline underline-offset-4">
          Voir les formules
        </Link>{" "}
        pour continuer votre accompagnement.
      </p>
    </div>
  );
}
