import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";
import { FavoritesList } from "@/components/favorites/favorites-list";

export const metadata: Metadata = { title: "Mes favoris" };

export default async function FavoritesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: favorites } = await supabase
    .from("favorites")
    .select("id, title, time, servings, ingredients, steps, source")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-medium">Mes favoris</h1>
        <p className="mt-1 text-muted-foreground">Retrouvez vos recettes sauvegardées en un clic.</p>
      </div>

      <FavoritesList favorites={favorites ?? []} />
    </div>
  );
}
