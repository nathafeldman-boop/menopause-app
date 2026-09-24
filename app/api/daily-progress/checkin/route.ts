import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { upsertTodayProgress } from "@/lib/daily-progress";

const VALID_MOODS = ["great", "good", "neutral", "hard"];

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const mood = body?.mood as string | undefined;
  const note = (body?.note as string | undefined)?.trim() || null;

  if (!mood || !VALID_MOODS.includes(mood)) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  try {
    await upsertTodayProgress(supabase, user.id, { mood, note });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/daily-progress/checkin]", err);
    return NextResponse.json({ error: "checkin_failed" }, { status: 500 });
  }
}
