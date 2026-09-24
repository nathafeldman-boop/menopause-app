import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Bell } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Notifications" };

function formatWhen(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  if (sameDay) return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: notifications } = await supabase
    .from("notifications")
    .select("id, title, body, href, read, created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(30);

  const unreadIds = (notifications ?? []).filter((n) => !n.read).map((n) => n.id);
  if (unreadIds.length > 0) {
    await supabase.from("notifications").update({ read: true }).in("id", unreadIds);
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/dashboard"
        className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Retour
      </Link>

      <h1 className="font-heading text-2xl font-medium">Notifications</h1>

      {!notifications || notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-8 text-center text-muted-foreground">
            <Bell className="h-6 w-6" />
            <p>Rien pour le moment.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-2.5">
          {notifications.map((n) => {
            const content = (
              <Card className={n.read ? "" : "border-primary/40 bg-primary/5"}>
                <CardContent className="flex items-start gap-3 p-4">
                  {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium">{n.title}</p>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatWhen(n.created_at)}
                      </span>
                    </div>
                    {n.body && <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>}
                  </div>
                </CardContent>
              </Card>
            );
            return n.href ? (
              <Link key={n.id} href={n.href}>
                {content}
              </Link>
            ) : (
              <div key={n.id}>{content}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}
