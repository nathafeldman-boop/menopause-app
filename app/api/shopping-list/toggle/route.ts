import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import type { ShoppingListItem } from "@/lib/ai/types";

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const itemId = body?.itemId as string | undefined;
  const checked = body?.checked as boolean | undefined;

  if (!itemId || typeof checked !== "boolean") {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const { data: plan, error: fetchError } = await supabase
    .from("meal_plans")
    .select("id, shopping_list")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (fetchError || !plan) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const items = (plan.shopping_list ?? []) as unknown as ShoppingListItem[];
  const updated = items.map((item) => (item.id === itemId ? { ...item, checked } : item));

  const { error: updateError } = await supabase
    .from("meal_plans")
    .update({ shopping_list: updated })
    .eq("id", plan.id);

  if (updateError) {
    return NextResponse.json({ error: "update_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
