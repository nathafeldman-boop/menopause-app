import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

import { SosFlow } from "@/components/sos/sos-flow";

export const metadata: Metadata = { title: "SOS repas" };

export default function SosPage() {
  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/dashboard"
        className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Retour
      </Link>
      <div>
        <h1 className="font-heading text-2xl font-medium">🆘 SOS repas</h1>
        <p className="mt-1 text-muted-foreground">
          Vous ne savez pas quoi manger ? Trois questions et une idée immédiate.
        </p>
      </div>
      <SosFlow />
    </div>
  );
}
