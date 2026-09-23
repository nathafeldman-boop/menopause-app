import Link from "next/link";

import { APP_NAME } from "@/lib/brand";
import { Button } from "@/components/ui/button";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <span className="font-heading text-xl font-medium">{APP_NAME}</span>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Se connecter</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/signup">Commencer</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
