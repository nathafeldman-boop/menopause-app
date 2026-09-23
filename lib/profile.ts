import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Tables } from "./supabase/database.types";
import type { UserProfileContext } from "./ai/types";

export type Profile = Tables<"profiles">;

export function toAiContext(profile: Profile | null): UserProfileContext {
  return {
    goal: profile?.goal ?? null,
    age: profile?.age ?? null,
    heightCm: profile?.height_cm ?? null,
    weightKg: profile?.weight_kg ?? null,
    menopauseStage: profile?.menopause_stage ?? null,
    symptoms: profile?.symptoms ?? null,
    activityLevel: profile?.activity_level ?? null,
    sleepQuality: profile?.sleep_quality ?? null,
    stressLevel: profile?.stress_level ?? null,
    hydration: profile?.hydration ?? null,
    dietType: profile?.diet_type ?? null,
    allergies: profile?.allergies ?? null,
    supplements: profile?.supplements ?? null,
    dislikedFoods: profile?.disliked_foods ?? null,
    cookingSkill: profile?.cooking_skill ?? null,
    cookingTime: profile?.cooking_time ?? null,
    snackingFrequency: profile?.snacking_frequency ?? null,
    householdSize: profile?.household_size ?? null,
    recipePreference: profile?.recipe_preference ?? null,
    importantNote: profile?.important_note ?? null,
    todaysMeals: profile?.todays_meals ?? null,
  };
}

export async function getProfile(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<Profile | null> {
  const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
  return data;
}
