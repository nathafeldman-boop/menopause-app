import type { Metadata } from "next";

import { IngredientsForm } from "@/components/ingredients/ingredients-form";

export const metadata: Metadata = { title: "Recettes avec mes ingrédients" };

export default function IngredientsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-medium">Que puis-je cuisiner ?</h1>
        <p className="mt-1 text-muted-foreground">
          Listez ou photographiez ce que vous avez, nous vous proposons 3 recettes adaptées.
        </p>
      </div>
      <IngredientsForm />
    </div>
  );
}
