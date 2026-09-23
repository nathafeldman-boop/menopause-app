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
    dietType: profile?.diet_type ?? null,
    allergies: profile?.allergies ?? null,
    dislikedFoods: profile?.disliked_foods ?? null,
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
