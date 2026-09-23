import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { getProfile, toAiContext } from "@/lib/profile";
import { ai } from "@/lib/ai";
import type { CoachMessage } from "@/lib/ai/types";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const conversationId = body?.conversationId as string | undefined;
  const message = (body?.message as string | undefined)?.trim();

  if (!conversationId || !message) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  // La lecture est protégée par RLS : si la conversation n'appartient pas à l'utilisateur, rien n'est retourné.
  const { data: conversation } = await supabase
    .from("coach_conversations")
    .select("id")
    .eq("id", conversationId)
    .single();

  if (!conversation) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const { error: insertUserError } = await supabase
    .from("coach_messages")
    .insert({ conversation_id: conversationId, role: "user", content: message });

  if (insertUserError) {
    return NextResponse.json({ error: "send_failed" }, { status: 500 });
  }

  const { data: history } = await supabase
    .from("coach_messages")
    .select("role, content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(30);

  try {
    const profile = await getProfile(supabase, user.id);
    const reply = await ai.coachReply((history ?? []) as CoachMessage[], toAiContext(profile));

    await supabase
      .from("coach_messages")
      .insert({ conversation_id: conversationId, role: "assistant", content: reply });

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[api/coach]", err);
    return NextResponse.json({ error: "reply_failed" }, { status: 500 });
  }
}
