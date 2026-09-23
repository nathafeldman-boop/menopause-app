import Link from "next/link";

import { APP_NAME } from "@/lib/brand";

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-5 py-10">
      <Link href="/" className="font-heading text-lg font-medium">
        {APP_NAME}
      </Link>
      <h1 className="mt-8 font-heading text-3xl font-medium">{title}</h1>
      <div className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground [&_strong]:text-foreground">
        {children}
      </div>
      <Link href="/" className="mt-10 text-sm text-primary underline underline-offset-4">
        ← Retour à l&apos;accueil
      </Link>
    </div>
  );
}
