import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const title = body?.title as string | undefined;
  const time = (body?.time as string | undefined) || null;
  const servings = (body?.servings as string | undefined) || null;
  const ingredients = Array.isArray(body?.ingredients) ? (body.ingredients as string[]) : [];
  const steps = Array.isArray(body?.steps) ? (body.steps as string[]) : [];
  const source = (body?.source as string | undefined) || "other";

  if (!title) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("favorites")
    .insert({ user_id: user.id, title, time, servings, ingredients, steps, source })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const id = body?.id as string | undefined;

  if (!id) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const { error } = await supabase.from("favorites").delete().eq("id", id).eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: "delete_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
