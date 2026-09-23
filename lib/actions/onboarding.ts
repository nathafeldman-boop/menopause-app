"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type OnboardingData = {
  goal: string;
  age: string;
  height_cm: string;
  weight_kg: string;
  menopause_stage: string;
  symptoms: string; // valeurs séparées par des virgules
  activity_level: string;
  sleep_quality: string;
  stress_level: string;
  hydration: string;
  diet_type: string;
  allergies: string;
  supplements: string;
  disliked_foods: string;
  cooking_skill: string;
  cooking_time: string;
  snacking_frequency: string;
  household_size: string;
  recipe_preference: string;
  important_note: string;
  todays_meals: string;
};

function toIntOrNull(value: string): number | null {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : null;
}

function toArrayOrNull(value: string): string[] | null {
  const items = value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return items.length > 0 ? items : null;
}

export async function completeOnboardingAction(data: OnboardingData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      goal: data.goal,
      age: toIntOrNull(data.age),
      height_cm: toIntOrNull(data.height_cm),
      weight_kg: toIntOrNull(data.weight_kg),
      menopause_stage: data.menopause_stage || null,
      symptoms: toArrayOrNull(data.symptoms),
      activity_level: data.activity_level || null,
      sleep_quality: data.sleep_quality || null,
      stress_level: data.stress_level || null,
      hydration: data.hydration || null,
      diet_type: data.diet_type,
      allergies: data.allergies || null,
      supplements: data.supplements || null,
      disliked_foods: data.disliked_foods || null,
      cooking_skill: data.cooking_skill || null,
      cooking_time: data.cooking_time || null,
      snacking_frequency: data.snacking_frequency || null,
      household_size: data.household_size,
      recipe_preference: data.recipe_preference,
      important_note: data.important_note || null,
      todays_meals: data.todays_meals || null,
      onboarding_completed: true,
    })
    .eq("id", user.id);

  if (error) {
    throw new Error("Impossible d'enregistrer votre profil. Merci de réessayer.");
  }

  redirect("/onboarding/apercu");
}
