import { Camera, ChefHat, Refrigerator, MessageCircle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const FEATURES = [
  {
    icon: Camera,
    title: "Analysez votre assiette",
    description:
      "Une photo suffit. Vous recevez un équilibre général, ce qui est déjà bien, et 2 ou 3 suggestions concrètes — jamais culpabilisantes.",
    demo: (
      <>
        <p className="text-xs text-muted-foreground">Équilibre général</p>
        <p className="font-heading text-3xl font-medium">78/100</p>
        <p className="mt-2 text-sm text-muted-foreground">
          « Ajoutez une source de légumes verts et un peu de calcium. »
        </p>
      </>
    ),
  },
  {
    icon: ChefHat,
    title: "Adaptez vos recettes",
    description:
      "Photographiez une recette, un livre ou une capture d'écran. Nous l'analysons et l'adaptons à vos objectifs en un clic.",
    demo: (
      <>
        <p className="text-xs text-muted-foreground">Recette adaptée</p>
        <p className="font-heading font-medium">+ 1 poignée d&apos;amandes (calcium)</p>
        <p className="mt-2 text-sm text-muted-foreground">
          « Portion de légumes légèrement augmentée pour plus de fibres. »
        </p>
      </>
    ),
  },
  {
    icon: Refrigerator,
    title: "Cuisinez avec ce que vous avez",
    description:
      "Listez ou photographiez vos ingrédients : poulet, courgettes, œufs, riz, feta… Nous vous proposons 3 recettes adaptées à votre profil.",
    demo: (
      <>
        <p className="text-xs text-muted-foreground">Avec vos ingrédients</p>
        <p className="font-heading font-medium">3 recettes proposées</p>
        <p className="mt-2 text-sm text-muted-foreground">
          « Rapide, familiale ou express : à vous de choisir. »
        </p>
      </>
    ),
  },
  {
    icon: MessageCircle,
    title: "Votre coach personnel",
    description:
      "Une question, une envie de grignoter, une idée de repas ? Votre coach répond, avec prudence sur tout ce qui touche à la santé.",
    demo: (
      <>
        <p className="text-xs text-muted-foreground">Mon coach</p>
        <p className="mt-1 text-sm">« Que puis-je cuisiner avec ce que j&apos;ai ? »</p>
      </>
    ),
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-16">
      <div className="flex flex-col gap-16">
        {FEATURES.map(({ icon: Icon, title, description, demo }, i) => (
          <div
            key={title}
            className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
          >
            <div
              className={`flex flex-col gap-4 ${i % 2 === 1 ? "lg:order-2" : ""}`}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </span>
              <h2 className="font-heading text-2xl font-medium">{title}</h2>
              <p className="text-muted-foreground leading-relaxed">{description}</p>
            </div>
            <Card className={i % 2 === 1 ? "lg:order-1" : ""}>
              <CardContent className="p-6">{demo}</CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}
