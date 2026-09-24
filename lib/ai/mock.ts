import type {
  AiProvider,
  MealAnalysisResult,
  RecipeScanResult,
  AdaptedRecipe,
  GeneratedRecipe,
  GeneratedRecipesResult,
  WeeklyMealPlan,
  DayPlan,
  PlannedMeal,
  PlannedMealIngredient,
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

  async scanRecipePhoto(_imageBase64, _mimeType, _profile, teaser) {
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
    const ing = (text: string, category: PlannedMealIngredient["category"]): PlannedMealIngredient => ({
      text,
      category,
    });
    const menu: Array<[string, string, string, PlannedMealIngredient[]][]> = [
      [
        [
          "Petit-déjeuner",
          "Yaourt grec, fruits rouges et amandes",
          "Source de calcium et de fibres pour bien démarrer.",
          [
            ing("2 yaourts grecs nature", "produits_laitiers"),
            ing("1 poignée de fruits rouges", "fruits_legumes"),
            ing("1 poignée d'amandes", "epicerie"),
          ],
        ],
        [
          "Déjeuner",
          "Saumon, quinoa et légumes rôtis",
          "Protéines et bonnes graisses, avec des légumes variés.",
          [
            ing("2 pavés de saumon", "viande_poisson_oeufs"),
            ing("150 g de quinoa", "epicerie"),
            ing("1 courgette", "fruits_legumes"),
            ing("1 poivron", "fruits_legumes"),
            ing("Huile d'olive", "condiments"),
          ],
        ],
        [
          "Dîner",
          "Soupe de lentilles corail",
          "Léger le soir, riche en fibres et en protéines végétales.",
          [
            ing("200 g de lentilles corail", "epicerie"),
            ing("1 oignon", "fruits_legumes"),
            ing("1 carotte", "fruits_legumes"),
            ing("Cumin", "condiments"),
          ],
        ],
      ],
      [
        [
          "Petit-déjeuner",
          "Porridge avoine et graines de lin",
          "Fibres douces pour le transit.",
          [ing("80 g de flocons d'avoine", "epicerie"), ing("Lait ou boisson végétale", "produits_laitiers"), ing("1 c. à soupe de graines de lin", "epicerie")],
        ],
        [
          "Déjeuner",
          "Poulet rôti, patates douces et brocolis",
          "Un classique équilibré et rassasiant.",
          [
            ing("2 filets de poulet", "viande_poisson_oeufs"),
            ing("2 patates douces", "fruits_legumes"),
            ing("1 brocoli", "fruits_legumes"),
          ],
        ],
        [
          "Dîner",
          "Omelette aux épinards",
          "Rapide, riche en protéines et en fer.",
          [ing("4 œufs", "viande_poisson_oeufs"), ing("1 poignée d'épinards frais", "fruits_legumes"), ing("Sel, poivre", "condiments")],
        ],
      ],
      [
        [
          "Petit-déjeuner",
          "Tartines complètes, fromage frais",
          "Un peu de calcium pour la matinée.",
          [ing("4 tranches de pain complet", "epicerie"), ing("Fromage frais", "produits_laitiers")],
        ],
        [
          "Déjeuner",
          "Bol de riz complet, œuf et légumes",
          "Simple, complet, facile à préparer à l'avance.",
          [
            ing("150 g de riz complet", "epicerie"),
            ing("2 œufs", "viande_poisson_oeufs"),
            ing("1 carotte râpée", "fruits_legumes"),
            ing("Sauce soja", "condiments"),
          ],
        ],
        [
          "Dîner",
          "Poêlée de courgettes et feta",
          "Léger avec une bonne source de calcium.",
          [ing("2 courgettes", "fruits_legumes"), ing("100 g de feta", "produits_laitiers"), ing("Huile d'olive", "condiments")],
        ],
      ],
      [
        [
          "Petit-déjeuner",
          "Smoothie banane, épinards et lait végétal",
          "Vitamines et fibres pour bien commencer.",
          [ing("1 banane", "fruits_legumes"), ing("1 poignée d'épinards", "fruits_legumes"), ing("Lait végétal", "produits_laitiers")],
        ],
        [
          "Déjeuner",
          "Cabillaud, riz et haricots verts",
          "Protéines maigres et légumes verts.",
          [
            ing("2 filets de cabillaud", "viande_poisson_oeufs"),
            ing("150 g de riz", "epicerie"),
            ing("200 g de haricots verts", "fruits_legumes"),
          ],
        ],
        [
          "Dîner",
          "Salade de pois chiches",
          "Protéines végétales, fraîche et rassasiante.",
          [
            ing("1 boîte de pois chiches", "epicerie"),
            ing("1 tomate", "fruits_legumes"),
            ing("1/2 concombre", "fruits_legumes"),
            ing("Huile d'olive, citron", "condiments"),
          ],
        ],
      ],
      [
        [
          "Petit-déjeuner",
          "Yaourt nature et flocons d'avoine",
          "Simple et rassasiant.",
          [ing("2 yaourts nature", "produits_laitiers"), ing("50 g de flocons d'avoine", "epicerie")],
        ],
        [
          "Déjeuner",
          "Gratin de courgettes à la ricotta",
          "Calcium et légumes dans un plat réconfortant.",
          [ing("3 courgettes", "fruits_legumes"), ing("200 g de ricotta", "produits_laitiers"), ing("Parmesan râpé", "produits_laitiers")],
        ],
        [
          "Dîner",
          "Velouté de potiron",
          "Léger, doux, riche en fibres.",
          [ing("500 g de potiron", "fruits_legumes"), ing("1 oignon", "fruits_legumes"), ing("Crème légère", "produits_laitiers")],
        ],
      ],
      [
        [
          "Petit-déjeuner",
          "Œufs brouillés et pain complet",
          "Bonne source de protéines du matin.",
          [ing("3 œufs", "viande_poisson_oeufs"), ing("2 tranches de pain complet", "epicerie")],
        ],
        [
          "Déjeuner",
          "Poêlée de crevettes, légumes et riz",
          "Rapide et équilibré.",
          [
            ing("200 g de crevettes", "viande_poisson_oeufs"),
            ing("150 g de riz", "epicerie"),
            ing("1 poivron", "fruits_legumes"),
            ing("1 courgette", "fruits_legumes"),
          ],
        ],
        [
          "Dîner",
          "Soupe miso et tofu",
          "Léger et réconfortant.",
          [ing("Pâte miso", "condiments"), ing("200 g de tofu", "viande_poisson_oeufs"), ing("Algues wakamé", "epicerie")],
        ],
      ],
      [
        [
          "Petit-déjeuner",
          "Pancakes à la banane sans sucre ajouté",
          "Un plaisir simple du dimanche.",
          [ing("2 bananes", "fruits_legumes"), ing("3 œufs", "viande_poisson_oeufs"), ing("100 g de farine", "epicerie")],
        ],
        [
          "Déjeuner",
          "Rôti de dinde, légumes de saison",
          "Repas familial équilibré.",
          [ing("600 g de rôti de dinde", "viande_poisson_oeufs"), ing("Légumes de saison au choix", "fruits_legumes")],
        ],
        [
          "Dîner",
          "Soupe de légumes maison",
          "Léger pour finir la semaine.",
          [ing("Légumes de saison au choix", "fruits_legumes"), ing("1 bouillon de légumes", "condiments")],
        ],
      ],
    ];

    const days: DayPlan[] = (teaser ? menu.slice(0, 1) : menu).map((meals, i) => ({
      day: dayNames[i],
      meals: meals.map(([type, name, description, ingredients]) => ({ type, name, description, ingredients })),
    }));

    return { days } satisfies WeeklyMealPlan;
  },

  async replaceMeal(day, mealIndex) {
    await fakeDelay();
    const meal = day.meals[mealIndex];
    return {
      type: meal.type,
      name: `${meal.type} alternatif`,
      description: "Une autre option simple et équilibrée, à votre goût.",
      ingredients: [
        { text: "Une source de protéines au choix", category: "viande_poisson_oeufs" },
        { text: "Une portion de légumes de saison", category: "fruits_legumes" },
        { text: "Un féculent au choix", category: "epicerie" },
      ],
    } satisfies PlannedMeal;
  },

  async suggestSosMeal(input, _profile, teaser) {
    await fakeDelay();
    const ingredients = [
      input.available ? `Ce que vous avez : ${input.available}` : "Ce que vous avez sous la main",
      "Un filet d'huile d'olive",
      "Sel, poivre, herbes au choix",
    ];
    return {
      name: `Idée rapide - ${input.time}`,
      time: input.time,
      ingredients: teaser ? ingredients.slice(0, 2) : ingredients,
      steps: teaser
        ? []
        : [
            "Préparez les ingrédients disponibles.",
            "Faites cuire à feu moyen quelques minutes.",
            "Assaisonnez et servez aussitôt.",
          ],
      whyFits: `Adapté à votre envie "${input.craving}" et au temps dont vous disposez.`,
    } satisfies GeneratedRecipe;
  },
};
