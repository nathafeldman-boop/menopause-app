import type { Metadata } from "next";

import { MealCaptureForm } from "@/components/meal/meal-capture-form";

export const metadata: Metadata = { title: "Photographier mon repas" };

export default function NewMealPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-medium">Votre repas</h1>
        <p className="mt-1 text-muted-foreground">
          Prenez une photo claire de votre assiette pour recevoir une analyse et des conseils
          concrets.
        </p>
      </div>
      <MealCaptureForm />
    </div>
  );
}
