import type { Metadata } from "next";

import { RecipeCaptureForm } from "@/components/recipe/recipe-capture-form";

export const metadata: Metadata = { title: "Scanner une recette" };

export default function RecipeScannerPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-medium">Scanner une recette</h1>
        <p className="mt-1 text-muted-foreground">
          Photo, capture d&apos;écran ou page de livre : nous lisons la recette pour vous.
        </p>
      </div>
      <RecipeCaptureForm />
    </div>
  );
}
