export type Flag = "present" | "absent" | "unclear";
export type Level = "low" | "moderate" | "high" | "unclear";

export type MealAnalysisResult = {
  mealDetected: boolean; // false si la photo ne montre pas clairement un repas/aliment
  score: number; // 0-100, équilibre général — n'a de sens que si mealDetected est true
  mealName: string;
  proteinFlag: Flag;
  vegFiberFlag: Flag;
  calciumFlag: Flag;
  carbsLevel: Level;
  fatLevel: Level;
  sugarFlag: Flag;
  goodPoints: string[];
  improvePoints: string[];
  suggestions: string[];
};

export type RecipeScanResult = {
  recipeDetected: boolean; // false si la photo ne montre pas clairement une recette
  title: string;
  summary: string;
  servings: string; // ex: "4 personnes", "" si indéterminé
  time: string; // ex: "45 min", "" si indéterminé
  ingredients: string[];
  steps: string[];
  goodPoints: string[];
  improvePoints: string[];
  fitScore: number; // 0-100, adéquation avec le profil
};

export type AdaptedIngredient = {
  text: string; // ex: "4 courgettes"
  note: string; // ex: "au lieu de 3" — chaîne vide si rien n'a changé
  isNew: boolean; // ingrédient ajouté qui n'était pas dans la recette originale
};

export type AdaptedRecipe = {
  title: string;
  fitScore: number; // 0-100, adéquation de la version adaptée (généralement > fitScore original)
  ingredients: AdaptedIngredient[];
  steps: string[];
  whatChanged: string[];
};

export type GeneratedRecipe = {
  name: string;
  time: string;
  ingredients: string[];
  steps: string[];
  whyFits: string;
};

export type GeneratedRecipesResult = {
  ingredientsDetected: boolean; // false si une photo a été fournie et ne montre pas d'aliments
  recipes: GeneratedRecipe[];
};

export type ShoppingCategory =
  | "fruits_legumes"
  | "viande_poisson_oeufs"
  | "produits_laitiers"
  | "epicerie"
  | "condiments";

export type PlannedMealIngredient = {
  text: string; // ex: "4 courgettes"
  category: ShoppingCategory;
};

export type PlannedMeal = {
  type: string; // ex: "Petit-déjeuner", "Déjeuner", "Dîner"
  name: string;
  description: string; // 1 phrase
  ingredients: PlannedMealIngredient[];
};

export type DayPlan = {
  day: string; // ex: "Lundi"
  meals: PlannedMeal[];
};

export type WeeklyMealPlan = {
  days: DayPlan[]; // 1 jour en mode aperçu, 7 en mode complet
};

export type ShoppingListItem = {
  id: string;
  text: string;
  category: ShoppingCategory;
  checked: boolean;
};

export type UserProfileContext = {
  goal: string | null;
  age: number | null;
  heightCm: number | null;
  weightKg: number | null;
  menopauseStage: string | null;
  symptoms: string[] | null;
  activityLevel: string | null;
  sleepQuality: string | null;
  stressLevel: string | null;
  hydration: string | null;
  dietType: string | null;
  allergies: string | null;
  supplements: string | null;
  dislikedFoods: string | null;
  cookingSkill: string | null;
  cookingTime: string | null;
  snackingFrequency: string | null;
  householdSize: string | null;
  recipePreference: string | null;
  importantNote: string | null;
  todaysMeals: string | null;
};

export type CoachMessage = { role: "user" | "assistant"; content: string };

export interface AiProvider {
  analyzeMealPhoto(
    imageBase64: string,
    mimeType: string,
    profile: UserProfileContext
  ): Promise<MealAnalysisResult>;

  scanRecipePhoto(
    imageBase64: string,
    mimeType: string,
    profile: UserProfileContext,
    teaser: boolean
  ): Promise<RecipeScanResult>;

  adaptRecipe(recipe: RecipeScanResult, profile: UserProfileContext): Promise<AdaptedRecipe>;

  generateRecipesFromIngredients(
    input: { ingredients?: string[]; image?: { data: string; mimeType: string } },
    profile: UserProfileContext,
    teaser: boolean
  ): Promise<GeneratedRecipesResult>;

  coachReply(messages: CoachMessage[], profile: UserProfileContext): Promise<string>;

  generateWeeklyMealPlan(
    profile: UserProfileContext,
    todaysMeals: string,
    teaser: boolean
  ): Promise<WeeklyMealPlan>;

  replaceMeal(day: DayPlan, mealIndex: number, profile: UserProfileContext): Promise<PlannedMeal>;

  suggestSosMeal(
    input: { time: string; craving: string; available: string },
    profile: UserProfileContext,
    teaser: boolean
  ): Promise<GeneratedRecipe>;
}
