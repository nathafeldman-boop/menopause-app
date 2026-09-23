import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { getProfile, toAiContext } from "@/lib/profile";
import { ai } from "@/lib/ai";
import { hasActiveSubscription } from "@/lib/subscription";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!(await hasActiveSubscription(supabase, user.id))) {
    return NextResponse.json({ error: "subscription_required" }, { status: 402 });
  }

  const formData = await request.formData();
  const file = formData.get("photo");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Aucune photo reçue." }, { status: 400 });
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type || "image/jpeg";
    const ext = mimeType.split("/")[1] || "jpg";
    const path = `${user.id}/meals/${randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("photos").upload(path, buffer, {
      contentType: mimeType,
      upsert: false,
    });
    if (uploadError) throw uploadError;

    const profile = await getProfile(supabase, user.id);
    const base64 = buffer.toString("base64");
    const analysis = await ai.analyzeMealPhoto(base64, mimeType, toAiContext(profile));

    const { data: row, error: insertError } = await supabase
      .from("meal_analyses")
      .insert({
        user_id: user.id,
        image_path: path,
        meal_name: analysis.mealName || null,
        score: analysis.score,
        protein_flag: analysis.proteinFlag,
        veg_fiber_flag: analysis.vegFiberFlag,
        calcium_flag: analysis.calciumFlag,
        carbs_level: analysis.carbsLevel,
        fat_level: analysis.fatLevel,
        sugar_flag: analysis.sugarFlag,
        good_points: analysis.goodPoints,
        improve_points: analysis.improvePoints,
        suggestions: analysis.suggestions,
        raw_ai: analysis,
      })
      .select("id")
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({ id: row.id });
  } catch (err) {
    console.error("[api/meals/analyze]", err);
    return NextResponse.json({ error: "analysis_failed" }, { status: 500 });
  }
}
