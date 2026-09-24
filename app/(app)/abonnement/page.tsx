import Link from "next/link";
import type { Metadata } from "next";
import { Camera, ChefHat, Refrigerator, MessageCircle, History, Check } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlanSelector } from "@/components/billing/plan-selector";
import { PauseSubscriptionButton } from "@/components/billing/pause-subscription-button";
import { ResumeSubscriptionButton } from "@/components/billing/resume-subscription-button";
import { TEST_BILLING_ENABLED } from "@/lib/billing";
import { cancelTestPlanAction } from "@/lib/actions/billing";

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

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan, status, current_period_end, paused_until")
    .eq("user_id", user!.id)
    .single();

  const isActive = subscription?.status === "active";
  const isPaused = subscription?.status === "paused";
  const currentPlan =
    subscription?.plan === "monthly" || subscription?.plan === "weekly" ? subscription.plan : null;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading text-2xl font-medium">Votre accompagnement</h1>
        <p className="mt-1 text-muted-foreground">
          Un abonnement simple, pensé pour vous accompagner durablement.
        </p>
      </div>

      {isActive && (
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Votre abonnement</p>
              <p className="font-heading text-xl font-medium">
                Formule {subscription?.plan === "monthly" ? "mensuelle" : "hebdomadaire"}
              </p>
            </div>
            <Badge variant="success">Actif</Badge>
          </CardContent>
        </Card>
      )}

      {isPaused && (
        <Card className="border-accent/40 bg-accent/5">
          <CardContent className="flex flex-col gap-3 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Votre abonnement</p>
                <p className="font-heading text-xl font-medium">
                  Formule {subscription?.plan === "monthly" ? "mensuelle" : "hebdomadaire"}
                </p>
              </div>
              <Badge variant="warning">En pause</Badge>
            </div>
            {subscription?.paused_until && (
              <p className="text-sm text-muted-foreground">
                Reprise automatique le{" "}
                {new Date(subscription.paused_until).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                })}
                .
              </p>
            )}
            {TEST_BILLING_ENABLED && <ResumeSubscriptionButton />}
          </CardContent>
        </Card>
      )}

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

      <PlanSelector currentPlan={currentPlan} isActive={isActive} />

      {TEST_BILLING_ENABLED && isActive && (
        <div className="flex flex-col gap-2">
          <PauseSubscriptionButton />
          <form action={cancelTestPlanAction}>
            <Button type="submit" variant="ghost" className="w-full text-muted-foreground">
              Résilier mon abonnement
            </Button>
          </form>
        </div>
      )}

      <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-muted/40 p-4 text-xs text-muted-foreground">
        <p className="flex items-center gap-1.5 font-medium text-foreground">
          <Check className="h-3.5 w-3.5" /> Transparent, sans engagement caché
        </p>
        <p>
          Vous pouvez annuler ou changer de formule à tout moment. Nous ne stockons jamais vos
          données bancaires. Voir nos{" "}
          <Link href="/cgv" className="text-primary underline underline-offset-4">
            conditions générales de vente
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
