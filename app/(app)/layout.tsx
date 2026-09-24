import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/profile";
import { hasActiveSubscription } from "@/lib/subscription";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/layout/bottom-nav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [profile, subscribed, { count: unreadCount }] = await Promise.all([
    getProfile(supabase, user.id),
    hasActiveSubscription(supabase, user.id),
    supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("read", false),
  ]);

  if (!profile?.onboarding_completed) {
    redirect("/onboarding");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader subscribed={subscribed} unreadCount={unreadCount ?? 0} />
      <div className="mx-auto w-full max-w-md flex-1 px-4 pb-24 pt-6">{children}</div>
      <BottomNav />
    </div>
  );
}
