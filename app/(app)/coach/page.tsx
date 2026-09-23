import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";
import { hasActiveSubscription } from "@/lib/subscription";
import { CoachChat } from "@/components/coach/coach-chat";
import { PaywallPrompt } from "@/components/billing/paywall-prompt";

export const metadata: Metadata = { title: "Mon coach" };

export default async function CoachPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const subscribed = await hasActiveSubscription(supabase, user!.id);

  if (!subscribed) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-heading text-2xl font-medium">Mon coach</h1>
          <p className="mt-1 text-muted-foreground">
            Posez toutes vos questions sur l&apos;alimentation au quotidien.
          </p>
        </div>
        <PaywallPrompt
          title="Débloquez votre coach personnel"
          description="Le coach IA fait partie de votre accompagnement Alma. Abonnez-vous pour lui poser vos questions à tout moment."
        />
      </div>
    );
  }

  const { data: existing } = await supabase
    .from("coach_conversations")
    .select("id")
    .eq("user_id", user!.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let conversationId = existing?.id;

  if (!conversationId) {
    const { data: created } = await supabase
      .from("coach_conversations")
      .insert({ user_id: user!.id })
      .select("id")
      .single();
    conversationId = created?.id;
  }

  const { data: messages } = await supabase
    .from("coach_messages")
    .select("id, role, content")
    .eq("conversation_id", conversationId!)
    .order("created_at", { ascending: true });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-medium">Mon coach</h1>
        <p className="mt-1 text-muted-foreground">
          Posez toutes vos questions sur l&apos;alimentation au quotidien.
        </p>
      </div>
      <CoachChat
        conversationId={conversationId!}
        initialMessages={(messages ?? []).map((m) => ({
          id: m.id,
          role: m.role as "user" | "assistant",
          content: m.content,
        }))}
      />
    </div>
  );
}
