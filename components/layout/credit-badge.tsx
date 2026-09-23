import Link from "next/link";

export function CreditBadge({ balance }: { balance: number }) {
  const low = balance <= 5;

  return (
    <Link
      href="/abonnement"
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
        low
          ? "border-warning/40 bg-warning/10 text-warning"
          : "border-border bg-muted text-foreground hover:bg-border"
      }`}
    >
      {balance} crédit{balance > 1 ? "s" : ""}
    </Link>
  );
}
