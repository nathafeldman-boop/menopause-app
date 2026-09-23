import Link from "next/link";
import type { Metadata } from "next";
import { Camera, ChefHat, Refrigerator, MessageCircle } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Accueil" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const { count: mealsThisWeek } = await supabase
    .from("meal_analyses")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user!.id)
    .gte("created_at", weekAgo.toISOString());

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-medium">Bonjour</h1>
        <p className="mt-1 text-muted-foreground">
          Qu&apos;aimeriez-vous faire aujourd&apos;hui&nbsp;?
        </p>
      </div>

      <Link href="/repas/nouveau">
        <Card className="border-primary/30 bg-primary/5 transition-colors hover:bg-primary/10">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Camera className="h-7 w-7" />
            </div>
            <div>
              <p className="font-heading text-lg font-medium">Photographier mon repas</p>
              <p className="text-sm text-muted-foreground">
                Recevez une analyse claire et des conseils concrets.
              </p>
            </div>
          </CardContent>
        </Card>
      </Link>

      <div className="grid grid-cols-2 gap-3">
        <Link href="/recette/scanner">
          <Card className="h-full transition-colors hover:bg-muted/60">
            <CardContent className="flex flex-col gap-3 p-4">
              <ChefHat className="h-6 w-6 text-secondary" />
              <p className="font-medium leading-snug">Scanner une recette</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/ingredients">
          <Card className="h-full transition-colors hover:bg-muted/60">
            <CardContent className="flex flex-col gap-3 p-4">
              <Refrigerator className="h-6 w-6 text-secondary" />
              <p className="font-medium leading-snug">Recettes avec mes ingrédients</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Link href="/coach">
        <Card className="transition-colors hover:bg-muted/60">
          <CardContent className="flex items-center gap-4 p-4">
            <MessageCircle className="h-6 w-6 text-secondary" />
            <div>
              <p className="font-medium">Parler à mon coach</p>
              <p className="text-sm text-muted-foreground">Une question ? Une idée de repas ?</p>
            </div>
          </CardContent>
        </Card>
      </Link>

      <Card>
        <CardContent className="flex items-center justify-between p-5">
          <div>
            <p className="text-sm text-muted-foreground">Cette semaine</p>
            <p className="font-heading text-xl font-medium">
              {mealsThisWeek ?? 0} repas analysé{(mealsThisWeek ?? 0) > 1 ? "s" : ""}
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/repas">Voir l&apos;historique</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
