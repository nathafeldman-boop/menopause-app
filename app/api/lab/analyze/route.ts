import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { getProfile, toAiContext } from "@/lib/profile";
import { getCorrectionHints } from "@/lib/food-corrections";
import { hasLabAccess } from "@/lib/lab-access";
import { ai } from "@/lib/ai";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !hasLabAccess(user.email)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("photo");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Aucune photo reçue." }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || "image/jpeg";
    const base64 = buffer.toString("base64");

    const [profile, correctionHints] = await Promise.all([
      getProfile(supabase, user.id),
      getCorrectionHints(supabase, user.id),
    ]);

    const analysis = await ai.analyzeMealPhoto(base64, mimeType, toAiContext(profile), correctionHints);

    return NextResponse.json({ analysis, correctionHintsUsed: correctionHints });
  } catch (err) {
    console.error("[api/lab/analyze]", err);
    return NextResponse.json({ error: "analysis_failed" }, { status: 500 });
  }
}
