"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type OnboardingData = {
  goal: string;
  diet_type: string;
  allergies: string;
  disliked_foods: string;
  household_size: string;
  recipe_preference: string;
  important_note: string;
};

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
      diet_type: data.diet_type,
      allergies: data.allergies || null,
      disliked_foods: data.disliked_foods || null,
      household_size: data.household_size,
      recipe_preference: data.recipe_preference,
      important_note: data.important_note || null,
      onboarding_completed: true,
    })
    .eq("id", user.id);

  if (error) {
    throw new Error("Impossible d'enregistrer votre profil. Merci de réessayer.");
  }

  redirect("/dashboard");
}
