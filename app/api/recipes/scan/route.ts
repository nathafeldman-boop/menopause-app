import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { ai } from "@/lib/ai";
import { spendCredits, refundCredits, InsufficientCreditsError } from "@/lib/credits";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("photo");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Aucune photo reçue." }, { status: 400 });
  }

  let newBalance: number;
  try {
    newBalance = await spendCredits(supabase, "recipe_scan");
  } catch (err) {
    if (err instanceof InsufficientCreditsError) {
      return NextResponse.json({ error: "insufficient_credits" }, { status: 402 });
    }
    throw err;
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type || "image/jpeg";
    const ext = mimeType.split("/")[1] || "jpg";
    const path = `${user.id}/recipes/${randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("photos").upload(path, buffer, {
      contentType: mimeType,
      upsert: false,
    });
    if (uploadError) throw uploadError;

    const base64 = buffer.toString("base64");
    const result = await ai.scanRecipePhoto(base64, mimeType);

    const { data: row, error: insertError } = await supabase
      .from("recipe_scans")
      .insert({
        user_id: user.id,
        image_path: path,
        title: result.title,
        summary: result.summary,
        good_points: result.goodPoints,
        improve_points: result.improvePoints,
        fit_score: result.fitScore,
        extracted: { ingredients: result.ingredients, steps: result.steps },
      })
      .select("id")
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({ id: row.id, creditsBalance: newBalance });
  } catch (err) {
    console.error("[api/recipes/scan]", err);
    await refundCredits(supabase, "recipe_scan").catch(() => {});
    return NextResponse.json({ error: "scan_failed" }, { status: 500 });
  }
}
