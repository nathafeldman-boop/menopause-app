import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/brand";

export function PaywallPrompt({
  title = "Passez à l'accompagnement complet",
  description = `Cette fonctionnalité fait partie de votre accompagnement ${APP_NAME}. Abonnez-vous pour y accéder dès maintenant.`,
}: {
  title?: string;
  description?: string;
}) {
  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Sparkles className="h-6 w-6" />
        </span>
        <div>
          <p className="font-heading text-lg font-medium">{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <Button asChild size="lg" className="w-full">
          <Link href="/abonnement">Voir les formules</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
