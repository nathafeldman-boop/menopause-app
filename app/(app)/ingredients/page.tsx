import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";
import { hasActiveSubscription } from "@/lib/subscription";
import { IngredientsForm } from "@/components/ingredients/ingredients-form";
import { PaywallPrompt } from "@/components/billing/paywall-prompt";

export const metadata: Metadata = { title: "Recettes avec mes ingrédients" };

export default async function IngredientsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const subscribed = await hasActiveSubscription(supabase, user!.id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-medium">Que puis-je cuisiner ?</h1>
        <p className="mt-1 text-muted-foreground">
          Listez ou photographiez ce que vous avez, nous vous proposons 3 recettes adaptées.
        </p>
      </div>
      {subscribed ? <IngredientsForm /> : <PaywallPrompt />}
    </div>
  );
}
