import { Camera, ChefHat, Refrigerator, MessageCircle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const FEATURES = [
  {
    icon: Camera,
    title: "Analysez votre assiette",
    description: "Une photo, un équilibre, 2 ou 3 suggestions.",
  },
  {
    icon: ChefHat,
    title: "Adaptez vos recettes",
    description: "Une photo de livre ou d'écran suffit.",
  },
  {
    icon: Refrigerator,
    title: "Cuisinez avec ce que vous avez",
    description: "3 recettes à partir de vos ingrédients.",
  },
  {
    icon: MessageCircle,
    title: "Un coach à qui parler",
    description: "Une envie, une question ? Il répond.",
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-16">
      <h2 className="mb-8 font-heading text-3xl font-medium">Tout ce qu&apos;Alma fait pour vous</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <Card key={title}>
            <CardContent className="flex flex-col gap-3 p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <p className="font-heading text-lg font-medium leading-snug">{title}</p>
              <p className="text-sm text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
