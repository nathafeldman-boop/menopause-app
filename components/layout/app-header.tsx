import Link from "next/link";
import { Bell } from "lucide-react";

import { APP_NAME } from "@/lib/brand";
import { Badge } from "@/components/ui/badge";

export function AppHeader({
  subscribed,
  unreadCount = 0,
}: {
  subscribed: boolean;
  unreadCount?: number;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="font-heading text-lg font-medium">
          {APP_NAME}
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/notifications" className="relative flex h-9 w-9 items-center justify-center">
            <Bell className="h-5 w-5 text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>
          {subscribed ? (
            <Badge variant="success">Abonnée</Badge>
          ) : (
            <Link href="/abonnement">
              <Badge variant="primary">S&apos;abonner</Badge>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
