import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import type { MealAnalysisResult } from "@/lib/ai/types";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const foodIndex = body?.foodIndex as number | undefined;
  const correctedName = (body?.correctedName as string | undefined)?.trim();

  if (typeof foodIndex !== "number" || !correctedName) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const { data: meal, error: fetchError } = await supabase
    .from("meal_analyses")
    .select("id, raw_ai")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !meal) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const analysis = meal.raw_ai as unknown as MealAnalysisResult | null;
  const food = analysis?.foods?.[foodIndex];

  if (!analysis || !food) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const detectedFood = food.name;
  const updatedFoods = analysis.foods.map((f, i) =>
    i === foodIndex ? { ...f, name: correctedName, confidence: "high" as const, userCorrected: true } : f
  );
  const updatedAnalysis = { ...analysis, foods: updatedFoods };

  const { error: updateError } = await supabase
    .from("meal_analyses")
    .update({ raw_ai: updatedAnalysis })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: "update_failed" }, { status: 500 });
  }

  await supabase.from("food_corrections").insert({
    user_id: user.id,
    meal_analysis_id: id,
    detected_food: detectedFood,
    corrected_food: correctedName,
  });

  return NextResponse.json({ ok: true });
}
