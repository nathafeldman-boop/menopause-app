"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function setNotificationsEnabledAction(enabled: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("unauthorized");

  const { error } = await supabase
    .from("profiles")
    .update({ notifications_enabled: enabled })
    .eq("id", user.id);
  if (error) throw error;

  revalidatePath("/profil");
}
