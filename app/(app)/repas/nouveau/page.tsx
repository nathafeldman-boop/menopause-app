import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { hasActiveSubscription } from "@/lib/subscription";
import { MealCaptureForm } from "@/components/meal/meal-capture-form";
import { PaywallPrompt } from "@/components/billing/paywall-prompt";

export const metadata: Metadata = { title: "Photographier mon repas" };

export default async function NewMealPage() {
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
        <h1 className="font-heading text-2xl font-medium">Votre repas</h1>
        <p className="mt-1 text-muted-foreground">
          Prenez une photo claire de votre assiette pour recevoir une analyse et des conseils
          concrets.
        </p>
      </div>
      {subscribed ? <MealCaptureForm /> : <PaywallPrompt />}
    </div>
  );
}
