import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/actions/auth";
import { NotificationToggle } from "@/components/profile/notification-toggle";
import { APP_NAME } from "@/lib/brand";
import { GOAL_LABELS } from "@/lib/labels";

export const metadata: Metadata = { title: "Mon profil" };

const DIET_LABELS: Record<string, string> = {
  omnivore: "Omnivore",
  vegetarian: "Végétarienne",
  other: "Autre",
};

const MENOPAUSE_STAGE_LABELS: Record<string, string> = {
  perimenopause: "Périménopause",
  menopause: "Ménopause confirmée",
  postmenopause: "Post-ménopause",
  unsure: "Je ne sais pas trop",
};

const ACTIVITY_LABELS: Record<string, string> = {
  sedentary: "Plutôt sédentaire",
  light: "Un peu active",
  active: "Régulièrement active",
  very_active: "Très active ou sportive",
};

const SLEEP_LABELS: Record<string, string> = {
  good: "Plutôt bon",
  average: "Moyen, irrégulier",
  poor: "Je dors mal souvent",
};

const STRESS_LABELS: Record<string, string> = {
  low: "Plutôt faible",
  moderate: "Modéré",
  high: "Élevé",
};

const HYDRATION_LABELS: Record<string, string> = {
  low: "Moins d'1 litre / jour",
  medium: "1 à 1,5 litre / jour",
  high: "Plus d'1,5 litre / jour",
};

const COOKING_SKILL_LABELS: Record<string, string> = {
  beginner: "Débutante",
  comfortable: "À l'aise",
  confident: "Très à l'aise",
};

const COOKING_TIME_LABELS: Record<string, string> = {
  short: "Moins de 15 min",
  medium: "15 à 30 min",
  long: "Plus de 30 min",
};

const SNACKING_LABELS: Record<string, string> = {
  rarely: "Rarement",
  sometimes: "Parfois",
  often: "Souvent",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const [profile, { data: subscription }] = await Promise.all([
    getProfile(supabase, user!.id),
    supabase.from("subscriptions").select("plan, status").eq("user_id", user!.id).single(),
  ]);
  const isActive = subscription?.status === "active";

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
          <ProfileRow label="Âge" value={profile?.age ? `${profile.age} ans` : "—"} />
          <ProfileRow label="Taille" value={profile?.height_cm ? `${profile.height_cm} cm` : "—"} />
          <ProfileRow label="Poids" value={profile?.weight_kg ? `${profile.weight_kg} kg` : "—"} />
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
          <CardTitle>Ma santé &amp; mon rythme</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <ProfileRow
            label="Stade"
            value={profile?.menopause_stage ? MENOPAUSE_STAGE_LABELS[profile.menopause_stage] ?? profile.menopause_stage : "—"}
          />
          <ProfileRow
            label="Symptômes"
            value={profile?.symptoms && profile.symptoms.length > 0 ? profile.symptoms.join(", ") : "Aucun indiqué"}
          />
          <ProfileRow
            label="Activité physique"
            value={profile?.activity_level ? ACTIVITY_LABELS[profile.activity_level] ?? profile.activity_level : "—"}
          />
          <ProfileRow
            label="Sommeil"
            value={profile?.sleep_quality ? SLEEP_LABELS[profile.sleep_quality] ?? profile.sleep_quality : "—"}
          />
          <ProfileRow
            label="Stress"
            value={profile?.stress_level ? STRESS_LABELS[profile.stress_level] ?? profile.stress_level : "—"}
          />
          <ProfileRow
            label="Hydratation"
            value={profile?.hydration ? HYDRATION_LABELS[profile.hydration] ?? profile.hydration : "—"}
          />
          <ProfileRow label="Compléments" value={profile?.supplements || "Aucun indiqué"} />
          <ProfileRow
            label="Niveau en cuisine"
            value={profile?.cooking_skill ? COOKING_SKILL_LABELS[profile.cooking_skill] ?? profile.cooking_skill : "—"}
          />
          <ProfileRow
            label="Temps de préparation"
            value={profile?.cooking_time ? COOKING_TIME_LABELS[profile.cooking_time] ?? profile.cooking_time : "—"}
          />
          <ProfileRow
            label="Grignotage"
            value={
              profile?.snacking_frequency
                ? SNACKING_LABELS[profile.snacking_frequency] ?? profile.snacking_frequency
                : "—"
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <NotificationToggle initialEnabled={profile?.notifications_enabled ?? true} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Abonnement</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Statut</p>
            <div className="mt-1">
              {isActive ? (
                <Badge variant="success">
                  Actif — formule {subscription?.plan === "monthly" ? "mensuelle" : "hebdomadaire"}
                </Badge>
              ) : (
                <Badge>Aucun abonnement actif</Badge>
              )}
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            <a href="/abonnement">Gérer</a>
          </Button>
        </CardContent>
      </Card>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {APP_NAME} propose des conseils alimentaires généraux et ne remplace pas l&apos;avis
        d&apos;un professionnel de santé. En cas de doute, de douleur ou de symptôme préoccupant,
        consultez votre médecin.
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
