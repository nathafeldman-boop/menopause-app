// JSON Schemas (sous-ensemble supporté par responseJsonSchema de l'API Gemini)

const FOOD_CATEGORY_ENUM = [
  "protein",
  "vegetable",
  "fruit",
  "grain",
  "legume",
  "dairy",
  "fat",
  "sauce",
  "herb_spice",
  "drink",
  "sweet",
  "other",
];

const foodInsightSchema = {
  type: "object",
  properties: {
    title: { type: "string", description: "Titre court, ex: 'Bonne source de protéines'" },
    explanation: {
      type: "string",
      description: "Explique POURQUOI, en te basant sur ce qui a réellement été identifié — jamais générique",
    },
    relatedFood: {
      type: "string",
      description: "Nom de l'aliment de 'foods' concerné, chaîne vide si le point est général",
    },
  },
  required: ["title", "explanation", "relatedFood"],
};

export const mealAnalysisSchema = {
  type: "object",
  properties: {
    mealDetected: {
      type: "boolean",
      description:
        "false si la photo ne montre PAS clairement un repas ou un aliment (table vide, objet, photo floue, personne, etc.)",
    },
    imageIssue: {
      type: "string",
      description:
        "Raison si la photo est difficile à exploiter de façon fiable (ex: 'photo trop sombre', 'image floue', 'nourriture trop éloignée', 'plusieurs plats mélangés impossibles à distinguer'). Chaîne vide si la photo est exploitable normalement.",
    },
    visualInventory: {
      type: "array",
      items: { type: "string" },
      description:
        "ÉTAPE 1 — avant toute identification : liste ce que tu observes visuellement de façon brute (forme, couleur, texture, position), sans encore nommer précisément les aliments. Ex: 'morceau rose-orangé avec surface grillée', 'petits éléments verts ronds'.",
    },
    foods: {
      type: "array",
      description:
        "ÉTAPE 2 — à partir de l'inventaire visuel ci-dessus, identifie chaque aliment distinct réellement visible. N'invente jamais un aliment qui n'a pas de trace dans visualInventory.",
      items: {
        type: "object",
        properties: {
          name: { type: "string", description: "Ex: 'saumon grillé', 'possible poulet effiloché'" },
          category: { type: "string", enum: FOOD_CATEGORY_ENUM },
          confidence: {
            type: "string",
            enum: ["high", "medium", "low", "unknown"],
            description:
              "high = aucun doute raisonnable. medium = probable mais partiellement masqué/ambigu. low = deux aliments visuellement proches possibles (ex: thon/poulet effiloché, courgette/concombre). unknown = impossible à identifier.",
          },
          evidence: { type: "string", description: "Ce qui est concrètement visible qui justifie cette identification" },
          preparation: {
            type: "string",
            description: "Ex: 'grillé', 'pané', 'en sauce', 'cru' — chaîne vide si non identifiable",
          },
          quantityEstimate: {
            type: "string",
            description:
              "Qualitatif uniquement, jamais un chiffre présenté comme exact. Ex: 'environ 100-130 g', 'petite portion', 'grande portion'. Chaîne vide si aucune référence de taille ne permet d'estimer.",
          },
          possibleAlternatives: {
            type: "array",
            items: { type: "string" },
            description: "0 à 3 alternatives plausibles, uniquement si confidence est 'low' ou 'unknown'",
          },
        },
        required: ["name", "category", "confidence", "evidence", "preparation", "quantityEstimate", "possibleAlternatives"],
      },
    },
    score: {
      type: "integer",
      minimum: 0,
      maximum: 100,
      description: "Équilibre général du repas. Si mealDetected est false, mettre 0.",
    },
    mealName: { type: "string", description: "Nom court du plat, ou chaîne vide si indéterminé" },
    proteinFlag: { type: "string", enum: ["present", "absent", "unclear"] },
    vegFiberFlag: { type: "string", enum: ["present", "absent", "unclear"] },
    calciumFlag: { type: "string", enum: ["present", "absent", "unclear"] },
    carbsLevel: { type: "string", enum: ["low", "moderate", "high", "unclear"] },
    fatLevel: { type: "string", enum: ["low", "moderate", "high", "unclear"] },
    sugarFlag: { type: "string", enum: ["present", "absent", "unclear"] },
    summary: {
      type: "string",
      description:
        "2-3 phrases, personnalisées et spécifiques à CE repas précis (jamais une phrase générique réutilisable pour n'importe quelle photo).",
    },
    positives: {
      type: "array",
      items: foodInsightSchema,
      description: "2 à 4 points positifs, chacun relié à un aliment réellement identifié dans 'foods'",
    },
    improvements: {
      type: "array",
      items: foodInsightSchema,
      description:
        "0 à 3 points d'amélioration, nuancés et jamais culpabilisants. Tableau vide si le repas est déjà cohérent — ne cherche jamais artificiellement un défaut.",
    },
    personalizedTip: {
      type: "string",
      description: "Un seul conseil concret et actionnable, tenant compte du profil de l'utilisatrice",
    },
    improvedVersion: {
      type: "string",
      description:
        "Courte proposition concrète de version ajustée de ce repas précis (garder X, ajuster Y) — chaîne vide si rien à ajuster",
    },
    nextActionLabel: {
      type: "string",
      description: "Une question de suivi pertinente pour CE repas, ex: 'Tu veux une version plus légère de ce repas ?'",
    },
  },
  required: [
    "mealDetected",
    "imageIssue",
    "visualInventory",
    "foods",
    "score",
    "mealName",
    "proteinFlag",
    "vegFiberFlag",
    "calciumFlag",
    "carbsLevel",
    "fatLevel",
    "sugarFlag",
    "summary",
    "positives",
    "improvements",
    "personalizedTip",
    "improvedVersion",
    "nextActionLabel",
  ],
};

export const recipeScanSchema = {
  type: "object",
  properties: {
    recipeDetected: {
      type: "boolean",
      description:
        "false si l'image ne montre PAS clairement une recette (photo, capture d'écran ou page de livre lisible)",
    },
    title: { type: "string" },
    summary: { type: "string", description: "Résumé en 1-2 phrases" },
    servings: { type: "string", description: "Ex: '4 personnes', chaîne vide si indéterminé" },
    time: { type: "string", description: "Ex: '45 min', chaîne vide si indéterminé" },
    ingredients: { type: "array", items: { type: "string" } },
    steps: { type: "array", items: { type: "string" } },
    goodPoints: { type: "array", items: { type: "string" } },
    improvePoints: { type: "array", items: { type: "string" } },
    fitScore: { type: "integer", minimum: 0, maximum: 100, description: "Adéquation avec le profil utilisatrice" },
  },
  required: [
    "recipeDetected",
    "title",
    "summary",
    "servings",
    "time",
    "ingredients",
    "steps",
    "goodPoints",
    "improvePoints",
    "fitScore",
  ],
};

export const adaptedRecipeSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    fitScore: {
      type: "integer",
      minimum: 0,
      maximum: 100,
      description:
        "Adéquation de la VERSION ADAPTÉE avec le profil utilisatrice, généralement supérieure au score de la recette originale",
    },
    ingredients: {
      type: "array",
      description: "Liste complète des ingrédients de la version adaptée",
      items: {
        type: "object",
        properties: {
          text: { type: "string", description: "Ex: '4 courgettes', '250 g de ricotta'" },
          note: {
            type: "string",
            description: "Précision sur ce qui a changé pour cet ingrédient, ex: 'au lieu de 3'. Chaîne vide si rien n'a changé.",
          },
          isNew: { type: "boolean", description: "true si cet ingrédient n'existait pas dans la recette originale" },
        },
        required: ["text", "note", "isNew"],
      },
    },
    steps: { type: "array", items: { type: "string" } },
    whatChanged: { type: "array", items: { type: "string" }, description: "Liste courte de ce qui a été adapté et pourquoi" },
  },
  required: ["title", "fitScore", "ingredients", "steps", "whatChanged"],
};

export const ingredientRecipesSchema = {
  type: "object",
  properties: {
    ingredientsDetected: {
      type: "boolean",
      description:
        "Si l'entrée est une liste textuelle, toujours true. Si une photo a été fournie, false si elle ne montre pas clairement des aliments/ingrédients.",
    },
    recipes: {
      type: "array",
      minItems: 1,
      maxItems: 3,
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          time: { type: "string", description: "Temps approximatif, ex: '20 min'" },
          ingredients: { type: "array", items: { type: "string" } },
          steps: { type: "array", items: { type: "string" } },
          whyFits: { type: "string", description: "Pourquoi cette recette correspond au profil" },
        },
        required: ["name", "time", "ingredients", "steps", "whyFits"],
      },
    },
  },
  required: ["ingredientsDetected", "recipes"],
};

const plannedMealSchema = {
  type: "object",
  properties: {
    type: { type: "string", description: "Ex: 'Petit-déjeuner', 'Déjeuner', 'Dîner'" },
    name: { type: "string" },
    description: { type: "string", description: "Une phrase, sans calories/grammes précis" },
    ingredients: {
      type: "array",
      description: "Ingrédients nécessaires pour ce repas, avec quantité approximative",
      items: {
        type: "object",
        properties: {
          text: { type: "string", description: "Ex: '4 courgettes', '200 g de saumon'" },
          category: {
            type: "string",
            enum: ["fruits_legumes", "viande_poisson_oeufs", "produits_laitiers", "epicerie", "condiments"],
          },
        },
        required: ["text", "category"],
      },
    },
  },
  required: ["type", "name", "description", "ingredients"],
};

export const weeklyMealPlanSchema = {
  type: "object",
  properties: {
    days: {
      type: "array",
      minItems: 1,
      maxItems: 7,
      items: {
        type: "object",
        properties: {
          day: { type: "string", description: "Ex: 'Lundi'" },
          meals: { type: "array", items: plannedMealSchema },
        },
        required: ["day", "meals"],
      },
    },
  },
  required: ["days"],
};

export const replaceMealSchema = plannedMealSchema;

export const sosMealSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    time: { type: "string", description: "Temps approximatif, ex: '20 min'" },
    ingredients: { type: "array", items: { type: "string" } },
    steps: { type: "array", items: { type: "string" } },
    whyFits: { type: "string", description: "Pourquoi cette idée correspond à la demande et au profil" },
  },
  required: ["name", "time", "ingredients", "steps", "whyFits"],
};
