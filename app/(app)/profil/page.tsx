import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/actions/auth";

export const metadata: Metadata = { title: "Mon profil" };

const GOAL_LABELS: Record<string, string> = {
  eat_better: "Mieux manger",
  lose_weight: "Perdre du poids progressivement",
  reduce_snacking: "Réduire le grignotage",
  structure_meals: "Mieux structurer mes repas",
  stay_fit: "Maintenir ma forme",
};

const DIET_LABELS: Record<string, string> = {
  omnivore: "Omnivore",
  vegetarian: "Végétarienne",
  other: "Autre",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const profile = await getProfile(supabase, user!.id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-medium">Mon profil</h1>
        <p className="mt-1 text-muted-foreground">{user?.email}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mes préférences</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <ProfileRow label="Objectif" value={profile?.goal ? GOAL_LABELS[profile.goal] ?? profile.goal : "—"} />
          <ProfileRow
            label="Alimentation"
            value={profile?.diet_type ? DIET_LABELS[profile.diet_type] ?? profile.diet_type : "—"}
          />
          <ProfileRow label="Allergies / intolérances" value={profile?.allergies || "Aucune indiquée"} />
          <ProfileRow label="Aliments non appréciés" value={profile?.disliked_foods || "Aucun indiqué"} />
          <ProfileRow label="Cuisine pour" value={profile?.household_size || "—"} />
          <ProfileRow label="Type de recettes" value={profile?.recipe_preference || "—"} />
          {profile?.important_note && (
            <ProfileRow label="À prendre en compte" value={profile.important_note} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Abonnement &amp; crédits</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Solde actuel</p>
            <p className="font-heading text-xl font-medium">{profile?.credits_balance ?? 0} crédits</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <a href="/abonnement">Gérer</a>
          </Button>
        </CardContent>
      </Card>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Alma propose des conseils alimentaires généraux et ne remplace pas l&apos;avis d&apos;un
        professionnel de santé. En cas de doute, de douleur ou de symptôme préoccupant, consultez
        votre médecin.
      </p>

      <form action={signOutAction}>
        <Button type="submit" variant="outline" className="w-full">
          Me déconnecter
        </Button>
      </form>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>
  );
}
