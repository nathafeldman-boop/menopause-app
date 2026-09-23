import Link from "next/link";

import { APP_NAME } from "@/lib/brand";
import { Badge } from "@/components/ui/badge";

export function AppHeader({ subscribed }: { subscribed: boolean }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="font-heading text-lg font-medium">
          {APP_NAME}
        </Link>
        {subscribed ? (
          <Badge variant="success">Abonnée</Badge>
        ) : (
          <Link href="/abonnement">
            <Badge variant="primary">S&apos;abonner</Badge>
          </Link>
        )}
      </div>
    </header>
  );
}
