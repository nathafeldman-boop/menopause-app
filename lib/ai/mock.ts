import type {
  AiProvider,
  MealAnalysisResult,
  RecipeScanResult,
  AdaptedRecipe,
  GeneratedRecipe,
  GeneratedRecipesResult,
  WeeklyMealPlan,
  DayPlan,
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

  async scanRecipePhoto(_imageBase64, _mimeType, teaser) {
    await fakeDelay();
    const ingredients = [
      "200 g de protéine au choix (poulet, poisson, légumineuses)",
      "2 poignées de légumes de saison",
      "1 portion de féculents (riz, quinoa ou pommes de terre)",
      "1 filet d'huile d'olive",
      "Sel, poivre, herbes fraîches",
    ];
    return {
      recipeDetected: true,
      title: "Recette repérée sur votre photo",
      summary:
        "Une recette qui semble équilibrée, avec une base de protéines et de légumes à confirmer visuellement.",
      servings: "4 personnes",
      time: "35 min",
      ingredients: teaser ? ingredients.slice(0, 2) : ingredients,
      steps: teaser
        ? []
        : [
            "Préparer et couper les légumes.",
            "Cuire la source de protéines à feu moyen.",
            "Ajouter les légumes et laisser mijoter quelques minutes.",
            "Servir avec les féculents et assaisonner.",
          ],
      goodPoints: teaser
        ? ["Bon équilibre protéines / légumes / féculents."]
        : ["Bon équilibre protéines / légumes / féculents.", "Recette simple à préparer."],
      improvePoints: teaser
        ? []
        : ["Une source de calcium pourrait être ajoutée (ex : un peu de fromage râpé)."],
      fitScore: 74,
    } satisfies RecipeScanResult;
  },

  async adaptRecipe(recipe) {
    await fakeDelay();
    return {
      title: `${recipe.title} — version adaptée`,
      fitScore: Math.min(100, recipe.fitScore + 14),
      ingredients: [
        ...recipe.ingredients.map((text) => ({ text, note: "", isNew: false })),
        { text: "1 poignée d'amandes effilées (source de calcium)", note: "", isNew: true },
      ],
      steps: [...recipe.steps, "Parsemer d'amandes concassées ou de graines avant de servir."],
      whatChanged: [
        "Ajout d'une source de calcium végétale.",
        "Portion de légumes légèrement augmentée pour plus de fibres.",
      ],
    } satisfies AdaptedRecipe;
  },

  async generateRecipesFromIngredients(input, _profile, teaser) {
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

    return {
      ingredientsDetected: true,
      recipes: teaser ? recipes.slice(0, 1) : recipes,
    } satisfies GeneratedRecipesResult;
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

  async generateWeeklyMealPlan(_profile, _todaysMeals, teaser) {
    await fakeDelay();
    const dayNames = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    const menu: Array<[string, string, string][]> = [
      [
        ["Petit-déjeuner", "Yaourt grec, fruits rouges et amandes", "Source de calcium et de fibres pour bien démarrer."],
        ["Déjeuner", "Saumon, quinoa et légumes rôtis", "Protéines et bonnes graisses, avec des légumes variés."],
        ["Dîner", "Soupe de lentilles corail", "Léger le soir, riche en fibres et en protéines végétales."],
      ],
      [
        ["Petit-déjeuner", "Porridge avoine et graines de lin", "Fibres douces pour le transit."],
        ["Déjeuner", "Poulet rôti, patates douces et brocolis", "Un classique équilibré et rassasiant."],
        ["Dîner", "Omelette aux épinards", "Rapide, riche en protéines et en fer."],
      ],
      [
        ["Petit-déjeuner", "Tartines complètes, fromage frais", "Un peu de calcium pour la matinée."],
        ["Déjeuner", "Bol de riz complet, œuf et légumes", "Simple, complet, facile à préparer à l'avance."],
        ["Dîner", "Poêlée de courgettes et feta", "Léger avec une bonne source de calcium."],
      ],
      [
        ["Petit-déjeuner", "Smoothie banane, épinards et lait végétal", "Vitamines et fibres pour bien commencer."],
        ["Déjeuner", "Cabillaud, riz et haricots verts", "Protéines maigres et légumes verts."],
        ["Dîner", "Salade de pois chiches", "Protéines végétales, fraîche et rassasiante."],
      ],
      [
        ["Petit-déjeuner", "Yaourt nature et flocons d'avoine", "Simple et rassasiant."],
        ["Déjeuner", "Gratin de courgettes à la ricotta", "Calcium et légumes dans un plat réconfortant."],
        ["Dîner", "Velouté de potiron", "Léger, doux, riche en fibres."],
      ],
      [
        ["Petit-déjeuner", "Œufs brouillés et pain complet", "Bonne source de protéines du matin."],
        ["Déjeuner", "Poêlée de crevettes, légumes et riz", "Rapide et équilibré."],
        ["Dîner", "Soupe miso et tofu", "Léger et réconfortant."],
      ],
      [
        ["Petit-déjeuner", "Pancakes à la banane sans sucre ajouté", "Un plaisir simple du dimanche."],
        ["Déjeuner", "Rôti de dinde, légumes de saison", "Repas familial équilibré."],
        ["Dîner", "Soupe de légumes maison", "Léger pour finir la semaine."],
      ],
    ];

    const days: DayPlan[] = (teaser ? menu.slice(0, 1) : menu).map((meals, i) => ({
      day: dayNames[i],
      meals: meals.map(([type, name, description]) => ({ type, name, description })),
    }));

    return { days } satisfies WeeklyMealPlan;
  },
};
