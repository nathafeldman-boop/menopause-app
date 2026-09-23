import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { hasActiveSubscription } from "@/lib/subscription";
import { IngredientsForm } from "@/components/ingredients/ingredients-form";

export const metadata: Metadata = { title: "Recettes avec mes ingrédients" };

export default async function IngredientsPage() {
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
        <h1 className="font-heading text-2xl font-medium">Que puis-je cuisiner ?</h1>
        <p className="mt-1 text-muted-foreground">
          Listez ou photographiez ce que vous avez, nous vous proposons{" "}
          {subscribed ? "3 recettes adaptées" : "une recette adaptée"}.
        </p>
      </div>
      <IngredientsForm subscribed={subscribed} />
    </div>
  );
}
