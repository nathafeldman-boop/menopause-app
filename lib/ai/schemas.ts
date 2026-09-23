// JSON Schemas (sous-ensemble supporté par responseJsonSchema de l'API Gemini)

export const mealAnalysisSchema = {
  type: "object",
  properties: {
    score: { type: "integer", minimum: 0, maximum: 100, description: "Équilibre général du repas" },
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
    title: { type: "string" },
    summary: { type: "string", description: "Résumé en 1-2 phrases" },
    ingredients: { type: "array", items: { type: "string" } },
    steps: { type: "array", items: { type: "string" } },
    goodPoints: { type: "array", items: { type: "string" } },
    improvePoints: { type: "array", items: { type: "string" } },
    fitScore: { type: "integer", minimum: 0, maximum: 100, description: "Adéquation avec le profil utilisatrice" },
  },
  required: ["title", "summary", "ingredients", "steps", "goodPoints", "improvePoints", "fitScore"],
};

export const adaptedRecipeSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    ingredients: { type: "array", items: { type: "string" } },
    steps: { type: "array", items: { type: "string" } },
    whatChanged: { type: "array", items: { type: "string" }, description: "Liste courte de ce qui a été adapté et pourquoi" },
  },
  required: ["title", "ingredients", "steps", "whatChanged"],
};

export const ingredientRecipesSchema = {
  type: "object",
  properties: {
    recipes: {
      type: "array",
      minItems: 3,
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
  required: ["recipes"],
};
