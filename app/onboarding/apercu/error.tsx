"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ApercuError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col gap-6 px-5 py-8">
      <Card className="border-destructive/30 bg-destructive/5">
        <CardContent className="flex flex-col gap-3 p-6 text-center">
          <p className="font-heading text-lg font-medium">Impossible de générer votre programme</p>
          <p className="text-sm text-muted-foreground">
            Une erreur est survenue pendant la création de votre aperçu. Merci de réessayer.
          </p>
          <Button onClick={reset} size="lg" className="mt-1">
            Réessayer
          </Button>
        </CardContent>
      </Card>
      <Button asChild variant="ghost" size="lg">
        <Link href="/dashboard">Continuer vers l&apos;application</Link>
      </Button>
    </div>
  );
}
