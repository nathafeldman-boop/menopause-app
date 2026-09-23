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

  const profile = await getProfile(supabase, user.id);

  if (!profile?.onboarding_completed) {
    redirect("/onboarding");
  }

  const subscribed = await hasActiveSubscription(supabase, user.id);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader subscribed={subscribed} />
      <div className="mx-auto w-full max-w-md flex-1 px-4 pb-24 pt-6">{children}</div>
      <BottomNav />
    </div>
  );
}
