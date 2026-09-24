"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CoursesError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex flex-col gap-6">
      <Card className="border-destructive/30 bg-destructive/5">
        <CardContent className="flex flex-col gap-3 p-6 text-center">
          <p className="font-heading text-lg font-medium">Impossible de générer votre liste</p>
          <p className="text-sm text-muted-foreground">
            Une erreur est survenue pendant la création de votre liste de courses. Merci de réessayer.
          </p>
          <Button onClick={reset} size="lg" className="mt-1">
            Réessayer
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
