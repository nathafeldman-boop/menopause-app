import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { getTodayProgress, upsertTodayProgress } from "@/lib/daily-progress";

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const mealType = body?.mealType as string | undefined;
  const done = body?.done as boolean | undefined;

  if (!mealType || typeof done !== "boolean") {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  try {
    const current = await getTodayProgress(supabase, user.id);
    const meals_done = done
      ? Array.from(new Set([...current.meals_done, mealType]))
      : current.meals_done.filter((m) => m !== mealType);

    await upsertTodayProgress(supabase, user.id, { meals_done });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/daily-progress/meal]", err);
    return NextResponse.json({ error: "update_failed" }, { status: 500 });
  }
}
