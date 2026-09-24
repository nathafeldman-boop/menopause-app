import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { getProfile, toAiContext } from "@/lib/profile";
import { hasActiveSubscription } from "@/lib/subscription";
import { ai } from "@/lib/ai";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const time = body?.time as string | undefined;
  const craving = body?.craving as string | undefined;
  const available = (body?.available as string | undefined)?.trim() ?? "";

  if (!time || !craving) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  try {
    const subscribed = await hasActiveSubscription(supabase, user.id);
    const profile = await getProfile(supabase, user.id);
    const suggestion = await ai.suggestSosMeal(
      { time, craving, available },
      toAiContext(profile),
      !subscribed
    );

    return NextResponse.json({ suggestion, isTeaser: !subscribed });
  } catch (err) {
    console.error("[api/sos]", err);
    return NextResponse.json({ error: "suggestion_failed" }, { status: 500 });
  }
}
