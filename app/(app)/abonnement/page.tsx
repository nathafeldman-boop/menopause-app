import type { Metadata } from "next";
import { Camera, ChefHat, Refrigerator, MessageCircle, History, Check } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/profile";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PLANS, CREDIT_PACKS, TEST_BILLING_ENABLED } from "@/lib/billing";
import { activateTestPlanAction, buyTestCreditPackAction } from "@/lib/actions/billing";

export const metadata: Metadata = { title: "Mon accompagnement" };

const FEATURES = [
  { icon: Camera, label: "Analyse de vos repas en photo" },
  { icon: ChefHat, label: "Adaptation de vos recettes" },
  { icon: Refrigerator, label: "Recettes à partir de vos ingrédients" },
  { icon: MessageCircle, label: "Coach IA disponible à tout moment" },
  { icon: History, label: "Historique complet de vos repas" },
];

export default async function AbonnementPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const profile = await getProfile(supabase, user!.id);

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan, status, current_period_end")
    .eq("user_id", user!.id)
    .single();

  const isActive = subscription?.status === "active";

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading text-2xl font-medium">Votre accompagnement</h1>
        <p className="mt-1 text-muted-foreground">
          Un abonnement simple, pensé pour vous accompagner durablement.
        </p>
      </div>

      <Card>
        <CardContent className="flex items-center justify-between p-5">
          <div>
            <p className="text-sm text-muted-foreground">Votre solde</p>
            <p className="font-heading text-2xl font-medium">{profile?.credits_balance ?? 0} crédits</p>
          </div>
          {isActive && (
            <Badge variant="success">
              Abonnement {subscription?.plan === "monthly" ? "mensuel" : "hebdomadaire"} actif
            </Badge>
          )}
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 font-heading text-lg font-medium">Ce qui est inclus</h2>
        <div className="flex flex-col gap-2.5">
          {FEATURES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 text-sm">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-4.5 w-4.5" />
              </span>
              {label}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Card className="relative overflow-hidden border-primary bg-primary/5">
          <div className="absolute right-0 top-0 rounded-bl-lg bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
            Le plus populaire
          </div>
          <CardContent className="flex flex-col gap-4 p-6">
            <div>
              <p className="font-heading text-xl font-medium">{PLANS.monthly.label}</p>
              <p className="mt-1">
                <span className="font-heading text-3xl font-medium">{PLANS.monthly.price}</span>
                <span className="text-muted-foreground"> {PLANS.monthly.period}</span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {PLANS.monthly.credits} crédits inclus chaque mois
              </p>
            </div>
            {TEST_BILLING_ENABLED ? (
              <form action={activateTestPlanAction.bind(null, "monthly")}>
                <Button type="submit" size="lg" className="w-full">
                  Commencer mon accompagnement
                </Button>
              </form>
            ) : (
              <Button size="lg" className="w-full" disabled>
                Bientôt disponible
              </Button>
            )}
            {TEST_BILLING_ENABLED && (
              <p className="text-center text-xs text-muted-foreground">
                Mode test — aucun paiement n&apos;est prélevé pour le moment.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-4 p-6">
            <div>
              <p className="font-heading text-xl font-medium">{PLANS.weekly.label}</p>
              <p className="mt-1">
                <span className="font-heading text-3xl font-medium">{PLANS.weekly.price}</span>
                <span className="text-muted-foreground"> {PLANS.weekly.period}</span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {PLANS.weekly.credits} crédits inclus chaque semaine
              </p>
            </div>
            {TEST_BILLING_ENABLED ? (
              <form action={activateTestPlanAction.bind(null, "weekly")}>
                <Button type="submit" variant="outline" size="lg" className="w-full">
                  Choisir l&apos;hebdomadaire
                </Button>
              </form>
            ) : (
              <Button variant="outline" size="lg" className="w-full" disabled>
                Bientôt disponible
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 font-heading text-lg font-medium">Besoin de plus de crédits ?</h2>
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
              <p className="font-heading text-lg font-medium">{CREDIT_PACKS.pack_100.label}</p>
              <p className="text-muted-foreground">{CREDIT_PACKS.pack_100.price}</p>
              {TEST_BILLING_ENABLED ? (
                <form action={buyTestCreditPackAction.bind(null, "pack_100")} className="w-full">
                  <Button type="submit" variant="outline" size="sm" className="w-full">
                    Acheter
                  </Button>
                </form>
              ) : (
                <Button variant="outline" size="sm" className="w-full" disabled>
                  Bientôt
                </Button>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
              <p className="font-heading text-lg font-medium">{CREDIT_PACKS.pack_500.label}</p>
              <p className="text-muted-foreground">{CREDIT_PACKS.pack_500.price}</p>
              {TEST_BILLING_ENABLED ? (
                <form action={buyTestCreditPackAction.bind(null, "pack_500")} className="w-full">
                  <Button type="submit" variant="outline" size="sm" className="w-full">
                    Acheter
                  </Button>
                </form>
              ) : (
                <Button variant="outline" size="sm" className="w-full" disabled>
                  Bientôt
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-muted/40 p-4 text-xs text-muted-foreground">
        <p className="flex items-center gap-1.5 font-medium text-foreground">
          <Check className="h-3.5 w-3.5" /> Transparent, sans engagement caché
        </p>
        <p>
          Chaque action IA consomme quelques crédits (affichés avant chaque analyse). Vous pouvez
          annuler ou changer de formule à tout moment. Nous ne stockons jamais vos données
          bancaires.
        </p>
      </div>
    </div>
  );
}
