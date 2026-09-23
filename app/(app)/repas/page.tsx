import Link from "next/link";
import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Mes repas" };

export default async function MealsHistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: meals } = await supabase
    .from("meal_analyses")
    .select("id, image_path, meal_name, score, created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekCount = (meals ?? []).filter((m) => new Date(m.created_at) >= weekAgo).length;

  const withUrls = await Promise.all(
    (meals ?? []).map(async (meal) => {
      const { data } = await supabase.storage.from("photos").createSignedUrl(meal.image_path, 3600);
      return { ...meal, url: data?.signedUrl ?? null };
    })
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-medium">Mes repas</h1>
        <p className="mt-1 text-muted-foreground">
          Vous avez analysé {weekCount} repas cette semaine.
        </p>
      </div>

      {withUrls.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
            <p className="text-muted-foreground">Vous n&apos;avez pas encore analysé de repas.</p>
            <Link href="/repas/nouveau" className="text-primary underline underline-offset-4">
              Analyser mon premier repas
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {withUrls.map((meal) => (
            <Link key={meal.id} href={`/repas/${meal.id}`}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardContent className="flex items-center gap-4 p-3">
                  {meal.url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={meal.url}
                      alt=""
                      className="h-16 w-16 shrink-0 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{meal.meal_name || "Repas analysé"}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(meal.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                      })}
                    </p>
                  </div>
                  <div className="font-heading text-lg font-medium">{meal.score}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
