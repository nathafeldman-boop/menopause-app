import Link from "next/link";

import { APP_NAME } from "@/lib/brand";
import { CreditBadge } from "@/components/layout/credit-badge";

export function AppHeader({ credits }: { credits: number }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="font-heading text-lg font-medium">
          {APP_NAME}
        </Link>
        <CreditBadge balance={credits} />
      </div>
    </header>
  );
}
