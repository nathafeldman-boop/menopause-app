import Link from "next/link";
import { Lock } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/brand";

export function LockedContent({
  label,
  description = `Débloquez la suite avec votre abonnement ${APP_NAME}.`,
  lines = 3,
  showCta = true,
}: {
  label: string;
  description?: string;
  lines?: number;
  showCta?: boolean;
}) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Lock className="h-4.5 w-4.5" />
        </span>
        <div className="w-full">
          <p className="font-medium">{label}</p>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          <div className="mt-4 flex flex-col items-center gap-2">
            {Array.from({ length: lines }).map((_, i) => (
              <span
                key={i}
                className="h-3 rounded-full bg-muted"
                style={{ width: `${85 - i * 15}%` }}
              />
            ))}
          </div>
        </div>
        {showCta && (
          <Button asChild size="sm">
            <Link href="/abonnement">Débloquer avec l&apos;abonnement</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
