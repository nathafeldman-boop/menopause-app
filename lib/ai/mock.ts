import type {
  AiProvider,
  MealAnalysisResult,
  RecipeScanResult,
  AdaptedRecipe,
  GeneratedRecipe,
} from "./types";

async function fakeDelay() {
  await new Promise((r) => setTimeout(r, 700 + Math.random() * 500));
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

export const mockProvider: AiProvider = {
  async analyzeMealPhoto(imageBase64) {
    await fakeDelay();
    const seed = imageBase64.length;

    const score = 60 + (seed % 31); // 60-90, mode démo optimiste et bienveillant

    return {
      mealDetected: true,
      score,
      mealName: pick(["Assiette repérée", "Repas composé", "Votre plat"], seed),
      proteinFlag: pick(["present", "present", "unclear"], seed),
      vegFiberFlag: pick(["present", "unclear", "absent"], seed + 1),
      calciumFlag: pick(["unclear", "present", "absent"], seed + 2),
      carbsLevel: pick(["moderate", "low", "high"], seed + 3),
      fatLevel: pick(["moderate", "low"], seed + 4),
      sugarFlag: pick(["absent", "unclear"], seed + 5),
      goodPoints: [
        "Une bonne source de protéines semble présente sur l'assiette.",
        "La composition paraît variée, c'est un bon réflexe.",
      ],
      improvePoints: [
        "Une portion de légumes supplémentaire apporterait plus de fibres.",
        "Pensez à une source de calcium si elle n'est pas déjà présente (yaourt, fromage, amandes).",
      ],
      suggestions: [
        "Ajoutez une poignée de légumes verts ou une salade à ce repas.",
        "Une petite portion de laitage ou d'oléagineux en complément pourrait être utile.",
        "Un filet d'huile d'olive crue apporte de bonnes graisses.",
      ],
    } satisfies MealAnalysisResult;
  },

  async scanRecipePhoto() {
    await fakeDelay();
    return {
      title: "Recette repérée sur votre photo",
      summary:
        "Une recette qui semble équilibrée, avec une base de protéines et de légumes à confirmer visuellement.",
      ingredients: [
        "200 g de protéine au choix (poulet, poisson, légumineuses)",
        "2 poignées de légumes de saison",
        "1 portion de féculents (riz, quinoa ou pommes de terre)",
        "1 filet d'huile d'olive",
        "Sel, poivre, herbes fraîches",
      ],
      steps: [
        "Préparer et couper les légumes.",
        "Cuire la source de protéines à feu moyen.",
        "Ajouter les légumes et laisser mijoter quelques minutes.",
        "Servir avec les féculents et assaisonner.",
      ],
      goodPoints: ["Bon équilibre protéines / légumes / féculents.", "Recette simple à préparer."],
      improvePoints: ["Une source de calcium pourrait être ajoutée (ex : un peu de fromage râpé)."],
      fitScore: 74,
    } satisfies RecipeScanResult;
  },

  async adaptRecipe(recipe) {
    await fakeDelay();
    return {
      title: `${recipe.title} — version adaptée`,
      ingredients: [
        ...recipe.ingredients,
        "1 poignée d'amandes ou de graines de sésame (source de calcium)",
      ],
      steps: [...recipe.steps, "Parsemer d'amandes concassées ou de graines avant de servir."],
      whatChanged: [
        "Ajout d'une source de calcium végétale.",
        "Portion de légumes légèrement augmentée pour plus de fibres.",
      ],
    } satisfies AdaptedRecipe;
  },

  async generateRecipesFromIngredients(input) {
    await fakeDelay();
    const ingredients = input.ingredients ?? [];
    const base = ingredients.length > 0 ? ingredients.slice(0, 3).join(", ") : "vos ingrédients";
    const fallbackIngredients = ingredients.length > 0 ? ingredients : ["Vos ingrédients du moment"];

    const recipes: GeneratedRecipe[] = [
      {
        name: `Poêlée rapide au ${base}`,
        time: "20 min",
        ingredients: fallbackIngredients,
        steps: [
          "Couper tous les ingrédients en morceaux réguliers.",
          "Faire chauffer un filet d'huile d'olive dans une poêle.",
          "Faire revenir les ingrédients 10 à 15 minutes en remuant régulièrement.",
          "Assaisonner et servir chaud.",
        ],
        whyFits: "Rapide à préparer et riche en légumes, adapté à un repas équilibré du quotidien.",
      },
      {
        name: `Gratin réconfortant`,
        time: "40 min",
        ingredients: fallbackIngredients,
        steps: [
          "Préchauffer le four à 200°C.",
          "Disposer les ingrédients dans un plat.",
          "Ajouter un peu de fromage râpé ou de crème légère.",
          "Enfourner 25 à 30 minutes jusqu'à coloration.",
        ],
        whyFits: "Une source de calcium via le fromage, idéale pour un repas familial.",
      },
      {
        name: `Bol composé express`,
        time: "15 min",
        ingredients: fallbackIngredients,
        steps: [
          "Cuire rapidement la base de féculents ou de protéines si nécessaire.",
          "Disposer tous les ingrédients dans un bol.",
          "Ajouter une vinaigrette maison à l'huile d'olive.",
          "Servir immédiatement.",
        ],
        whyFits: "Formule très rapide, pratique pour les soirs pressés tout en restant équilibrée.",
      },
    ];

    return recipes;
  },

  async coachReply(messages) {
    await fakeDelay();
    const last = messages[messages.length - 1]?.content?.toLowerCase() ?? "";

    if (last.includes("douleur") || last.includes("symptôme") || last.includes("mal")) {
      return "Je comprends votre préoccupation, mais je ne suis pas en mesure d'évaluer une douleur ou un symptôme — c'est important d'en parler avec votre médecin. Côté alimentation, je reste à votre disposition pour vous accompagner au quotidien.";
    }

    if (last.includes("grignot")) {
      return "Pour une envie de grignoter, misez sur quelque chose qui associe fibres et un peu de protéines : une poignée d'amandes, un yaourt nature, ou quelques bâtonnets de légumes avec du houmous. Cela calme la faim sans excès de sucre.";
    }

    if (last.includes("ce soir") || last.includes("dîner") || last.includes("diner")) {
      return "Ce soir, je vous suggère une assiette simple : une source de protéines (œufs, poisson ou légumineuses), une bonne portion de légumes, et un peu de féculents complets si vous avez faim. Voulez-vous une idée précise selon ce que vous avez au frigo ?";
    }

    return "Bonne question ! Pouvez-vous m'en dire un peu plus (ce que vous avez sous la main, votre envie du moment) pour que je vous propose quelque chose d'adapté ?";
  },
};
