import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";
import { hasLabAccess } from "@/lib/lab-access";
import { LabFlow } from "@/components/lab/lab-flow";

export const metadata: Metadata = { title: "Lab — Reconnaissance alimentaire" };

export default async function LabReconnaissancePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!hasLabAccess(user?.email)) redirect("/dashboard");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-medium">Lab — Reconnaissance alimentaire</h1>
        <p className="mt-1 text-muted-foreground">
          Outil interne : teste une photo et inspecte le raisonnement complet de l&apos;IA, sans
          rien enregistrer.
        </p>
      </div>
      <LabFlow />
    </div>
  );
}
