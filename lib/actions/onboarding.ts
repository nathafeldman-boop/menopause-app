"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type OnboardingData = {
  goal: string;
  age: string;
  height_cm: string;
  weight_kg: string;
  diet_type: string;
  allergies: string;
  disliked_foods: string;
  household_size: string;
  recipe_preference: string;
  important_note: string;
  todays_meals: string;
};

function toIntOrNull(value: string): number | null {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : null;
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
      diet_type: data.diet_type,
      allergies: data.allergies || null,
      disliked_foods: data.disliked_foods || null,
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
