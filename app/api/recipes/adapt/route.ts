import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { getProfile, toAiContext } from "@/lib/profile";
import { ai } from "@/lib/ai";
import type { RecipeScanResult } from "@/lib/ai/types";
import { spendCredits, refundCredits, InsufficientCreditsError } from "@/lib/credits";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const recipeId = body?.recipeId as string | undefined;

  if (!recipeId) {
    return NextResponse.json({ error: "missing_recipe_id" }, { status: 400 });
  }

  const { data: recipe, error: fetchError } = await supabase
    .from("recipe_scans")
    .select("*")
    .eq("id", recipeId)
    .single();

  if (fetchError || !recipe) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  let newBalance: number;
  try {
    newBalance = await spendCredits(supabase, "recipe_adapt", recipeId);
  } catch (err) {
    if (err instanceof InsufficientCreditsError) {
      return NextResponse.json({ error: "insufficient_credits" }, { status: 402 });
    }
    throw err;
  }

  try {
    const extracted = (recipe.extracted ?? {}) as { ingredients?: string[]; steps?: string[] };
    const recipeForAi: RecipeScanResult = {
      title: recipe.title ?? "Recette",
      summary: recipe.summary ?? "",
      ingredients: extracted.ingredients ?? [],
      steps: extracted.steps ?? [],
      goodPoints: recipe.good_points,
      improvePoints: recipe.improve_points,
      fitScore: recipe.fit_score ?? 0,
    };

    const profile = await getProfile(supabase, user.id);
    const adapted = await ai.adaptRecipe(recipeForAi, toAiContext(profile));

    const { error: updateError } = await supabase
      .from("recipe_scans")
      .update({ adapted })
      .eq("id", recipeId);

    if (updateError) throw updateError;

    return NextResponse.json({ adapted, creditsBalance: newBalance });
  } catch (err) {
    console.error("[api/recipes/adapt]", err);
    await refundCredits(supabase, "recipe_adapt", recipeId).catch(() => {});
    return NextResponse.json({ error: "adapt_failed" }, { status: 500 });
  }
}
