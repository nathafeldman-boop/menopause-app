import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { hasActiveSubscription } from "@/lib/subscription";
import { RecipeCaptureForm } from "@/components/recipe/recipe-capture-form";
import { PaywallPrompt } from "@/components/billing/paywall-prompt";

export const metadata: Metadata = { title: "Scanner une recette" };

export default async function RecipeScannerPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const subscribed = await hasActiveSubscription(supabase, user!.id);

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/dashboard"
        className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Retour
      </Link>
      <div>
        <h1 className="font-heading text-2xl font-medium">Scanner une recette</h1>
        <p className="mt-1 text-muted-foreground">
          Photo, capture d&apos;écran ou page de livre : nous lisons la recette pour vous.
        </p>
      </div>
      {subscribed ? <RecipeCaptureForm /> : <PaywallPrompt />}
    </div>
  );
}
