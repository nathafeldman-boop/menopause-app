// JSON Schemas (sous-ensemble supporté par responseJsonSchema de l'API Gemini)

export const mealAnalysisSchema = {
  type: "object",
  properties: {
    mealDetected: {
      type: "boolean",
      description:
        "false si la photo ne montre PAS clairement un repas ou un aliment (table vide, objet, photo floue, personne, etc.)",
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
    goodPoints: { type: "array", items: { type: "string" }, description: "2 à 4 points positifs, phrases courtes" },
    improvePoints: { type: "array", items: { type: "string" }, description: "1 à 3 points à améliorer, jamais culpabilisants" },
    suggestions: { type: "array", items: { type: "string" }, description: "2 à 3 suggestions très concrètes" },
  },
  required: [
    "mealDetected",
    "score",
    "mealName",
    "proteinFlag",
    "vegFiberFlag",
    "calciumFlag",
    "carbsLevel",
    "fatLevel",
    "sugarFlag",
    "goodPoints",
    "improvePoints",
    "suggestions",
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
