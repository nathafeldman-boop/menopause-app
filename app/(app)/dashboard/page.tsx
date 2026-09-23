import Link from "next/link";
import type { Metadata } from "next";
import { Camera, ChefHat, Refrigerator, MessageCircle, Image as ImageIcon, ChevronRight } from "lucide-react";

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

      <Card>
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/60 text-muted-foreground">
            <ImageIcon className="h-8 w-8" />
            <p className="text-xs">Photo d&apos;ambiance : une assiette</p>
          </div>
          <div>
            <p className="font-heading text-lg font-medium">Photographiez votre repas</p>
            <p className="text-sm text-muted-foreground">
              Une analyse claire et des conseils concrets, en quelques secondes.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/repas/nouveau">
              <Camera className="h-5 w-5" /> Photographier mon repas
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Link href="/recette/scanner">
          <Card className="h-full transition-colors hover:bg-muted/60">
            <CardContent className="flex flex-col gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/15 text-secondary">
                <ChefHat className="h-5 w-5" />
              </div>
              <p className="font-medium leading-snug">Scanner une recette</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/ingredients">
          <Card className="h-full transition-colors hover:bg-muted/60">
            <CardContent className="flex flex-col gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/15 text-secondary">
                <Refrigerator className="h-5 w-5" />
              </div>
              <p className="font-medium leading-snug">Recettes avec mes ingrédients</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Link href="/coach">
        <Card className="transition-colors hover:bg-muted/60">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-secondary">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Parler à mon coach</p>
              <p className="text-sm text-muted-foreground">Une question ? Une idée de repas ?</p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
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
