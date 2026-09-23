import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { generateWeeklyPlanForUser } from "@/lib/meal-plan";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const row = await generateWeeklyPlanForUser(supabase, user.id);
    return NextResponse.json({ id: row.id });
  } catch (err) {
    console.error("[api/meal-plan/generate]", err);
    return NextResponse.json({ error: "generation_failed" }, { status: 500 });
  }
}
